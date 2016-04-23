// This object type models a fosp connection
import { EventEmitter } from './events';
import { Request } from './request';
import { Response } from './response';
import { Notification } from './notification';
import { Message, messageToString } from './message';
import { parseMessage } from './parser';
import { serializeMessage } from './serializer';
import { debug, warn, error, info } from './logger';

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

export default class Connection extends EventEmitter {
    ws: WebSocket;
    currentSeq: number;
    pendingRequests: deferedMap;
    requestTimeout: number;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this.currentSeq = 1;
        this.pendingRequests = {};
        this.requestTimeout = 15000;

        this.ws.onmessage = (message) => {
            var data = message.data;
            parseMessage(data).then(([msg, seq]) => {
                debug("fosp: received message ", seq, msg);
                this.emit('message', msg, seq);
            }).catch((err: any) => {
                error(err);
            });
        };
        this.ws.onclose = (ev) => { this.emit('close', ev.code, ev.reason); };
        this.ws.onerror = (err) => { this.emit('error', err); };

        this.on('message', (msg: Message, seq: number) => {
            if ('method' in msg) {
                this.emit('request', msg, seq);
            } else if ('status' in msg) {
                this.emit('response', msg, seq);
            } else if ('event' in msg) {
                this.emit('notification', msg);
            } else {
                warn('fosp: recieved unknow type of message');
                debug('fosp: message is ', msg);
            }
        });

        this.on('response', (msg: Response, seq: number) => {
            var defer = this.pendingRequests[seq];
            if (typeof defer !== 'undefined') {
                clearTimeout(defer.timeoutHandle);
                delete this.pendingRequests[seq];
                defer.resolve(msg);
            }
        });

        this.on('close', (code: number, reason: string) => {
            info('Connection closed, code ' + code + ': ' + reason);
        });

        this.on('error', () => {
            error('fosp: fatal! unrecoverable error occured on connection');
        });
    }

    static open(options: openOptions) {
        var scheme = options.scheme || 'wss', host = options.host, port = options.port || 1337;
        return new Promise<Connection>((resolve: Function, reject: Function) => {
            var ws = new WebSocket(scheme + '://' + host + ':' + port);
            ws.binaryType = 'arraybuffer';
            ws.onopen = () => {
                resolve(new Connection(ws));
            };
            ws.onerror = (e) => {
                reject(e);
            };
        });
    }

    isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }

    sendMessage(msg: (Request|Response|Notification), seq: number) {
        debug("fosp: sending message ", seq, msg);
        try {
            let raw = serializeMessage(msg, seq);
            this.ws.send(raw);
        }
        catch(e) {
            console.error(e);
        }
    }

    close() {
        this.ws.close();
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
