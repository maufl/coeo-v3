import BackgroundConnection from './background-connection';
import {SUCCEEDED, FAILED} from './response';
import {Request, Method, AUTH, GET, READ, LIST, CREATE, WRITE, PATCH} from './request';
import {Response} from './response';
import {URL as FOSPURL} from './url';
import {EventEmitter} from './events';
import {FospObject} from './object';

export class FospService extends EventEmitter {
    currentUser: string;
    connection: BackgroundConnection = null;
    connecting: boolean = false;

    open(domain: string) {
        this.connecting = true;
        let options = {
            host: domain,
            scheme: domain.match(/^localhost(\.localdomain)?$/) ? 'ws' : 'wss'
        };
        return BackgroundConnection.open(options).then((con: BackgroundConnection) => {
            this.connection = con
            this.connecting = false;
            this.emit('connected');
            return Promise.resolve();
        });
    }

    awaitConnection(): Promise<string> {
        if (!this.connecting) {
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
                reject("Timeout while waiting for the connection.");
            }, 1500);
            this.on('connected', () => {
                clearTimeout(timeout);
                resolve(null);
            })
        })
    }

    authenticate(username: string, password: string) {
        var initialResponse = `\0${username}\0${password}`;
        var body = {
            sasl: {
                mechanism: "PLAIN",
                'initial-response': initialResponse
            }
        }
        return this.sendRequest({method: AUTH, resource: '*', body: body}).then(() => {
            this.currentUser = username;
            this.emit('authenticated');
            return true
        });
    }

    get(resource: string): Promise<FospObject> {
        return this.sendRequest({ method: GET, resource });
    }

    patch(resource: string, body: Object) {
        return this.sendRequest({ method: PATCH, resource, body });
    }

    list(resource: string): Promise<string[]> {
      return this.sendRequest({ method: LIST, resource });
    }

    read(resource: string): Promise<Blob> {
      return this.sendRequest({ method: READ, resource });
    }

    write(resource: string, body: Blob) {
      return this.sendRequest({ method: WRITE, resource, body });
    }

    create(resource: string, body: Object) {
      return this.sendRequest({ method: CREATE, resource, body });
    }

    sendRequest(req: Request): Promise<any> {
        if (this.connection === null && !this.connecting) {
            return Promise.reject("Not connected");
        }
        return this.awaitConnection().then(() => {
            return this.connection.sendRequest(req);
        }).then((response: Response) => {
            if (response.status === FAILED) {
                return Promise.reject(response);
            }
            return response.body;
        })
    }

    ensureExistence(id: string): Promise<any> {
        if (id.indexOf('/') === id.length - 1) {
            return Promise.resolve(true);
        }
        var parent = id.split('/').slice(0, -1).join('/');
        return this.ensureExistence(parent).then(() => {
            return this.get(id).catch(() => {
                return this.create(id, {});
            })
        })
    }
}

export default new FospService();
