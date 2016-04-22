import Connection from './connection';

const context = self;
const events = ['message', 'request', 'response', 'notification', 'close', 'error'];

var connection = null;

context.onmessage = (event) => {
    const [ message, args ] = event.data;
    switch (message) {
    case 'open':
        connection = Connection.open.apply(Connection, args).then((c) => {
            connection = c;
            events.forEach( event => {
                connection.on(event, (...args) => context.postMessage([event, args]));
            });
            context.postMessage(['open', 'Successfully opened connection']);
        }).catch((e) => {
            context.postMessage(['error', `Could not open connection: ${e}`])
        });
        break;
    case 'sendMessage':
        if (connection) {
            connection.sendMessage.apply(connection, args);
        } else {
            context.postMessage(['error', 'Connection is not opened']);
        }
        break;
    case 'close':
        connection.close();
        break;
    }
}
