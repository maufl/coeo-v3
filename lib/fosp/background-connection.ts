import { EventEmitter } from './events';
import { Request } from './request';
import { Response } from './response';
import { Notification } from './notification';
import { Message } from './message';

let ConnectionWorker = require('worker!./connection-worker');

interface defered {
  resolve: Function,
  reject: Function,
  timeoutHandle?: number
}

interface deferedMap {
  [key: number]: defered
}

interface openOptions {
  scheme?: string,
  host: string,
  port?: string
}

class BackgroundConnection extends EventEmitter {
    worker: any;
    currentSeq: number;
    pendingRequests: deferedMap;
    requestTimeout: number;
    opened: boolean = true;

    constructor(worker: any) {
        super();
        this.worker = worker
        this.currentSeq = 1;
        this.pendingRequests = {};
        this.requestTimeout = 15000;

        this.worker.onmessage = (event) => {
            const [message, args] = event.data;
            this.emit(message, ...args);
        }

        this.on('response', (msg: Response, seq: number) => {
            var defer = this.pendingRequests[seq];
            if (typeof defer !== 'undefined') {
                clearTimeout(defer.timeoutHandle);
                delete this.pendingRequests[seq];
                defer.resolve(msg);
            }
        });

        this.on('close', (code: number, reason: string) => {
            this.opened = false;
            console.info('Connection closed, code ' + code + ': ' + reason);
        });

        this.on('error', (err: Event) => {
            console.error('fosp: fatal! unrecoverable error occured on connection');
            console.error(err);
        });
    }

    static open(options: openOptions) {
        const worker = new ConnectionWorker();
        const promise = new Promise<BackgroundConnection>((resolve: Function, reject: Function) => {
            worker.onmessage = (event) => {
                const [message, args] = event.data;
                if (message === 'open') {
                    resolve(new BackgroundConnection(worker));
                } else {
                    reject(args);
                }
            }
        });
        worker.postMessage(['open', [options]]);
        return promise;
    }

    isOpen() {
        return this.opened;
    }

    sendMessage(msg: (Request|Response|Notification), seq: number) {
        this.worker.postMessage(['sendMessage', [msg, seq]]);
    }

    close() {
        this.worker.postMessage(['close']);
    }

    // Convinience for sending requests
    sendRequest(req: Request) {
        var defer: defered = { resolve: null, reject: null }, promise = new Promise((res: Function, rej: Function) => { defer.resolve = res; defer.reject = rej; });
        var seq = this.currentSeq;
        this.currentSeq++;
        this.pendingRequests[seq] = defer;
        defer.timeoutHandle = setTimeout(() => {
            delete this.pendingRequests[seq];
            defer.reject('timeout');
        }, this.requestTimeout);
        this.sendMessage(req, seq);
        return promise;
    }
}

export default BackgroundConnection;