// Message parser
import { Header } from './message';
import { Request, Methods, Method } from './request';
import { Response, Statuses, Status } from './response';
import { Notification, Events, Event } from './notification';

export const parseMessage = (raw: (ArrayBuffer|string)): Promise<[Request|Response|Notification, number]> => {
    return new Promise((resolve: Function, reject: Function) => {
        try {
            if ( raw instanceof ArrayBuffer ) {
                resolve(parseMessageBuffer(raw));
            }
            else if ( typeof raw === 'string' ) {
                resolve(parseMessageString(raw));
            }
            else {
                reject(new Error('Unable to parse ' + raw.toString() + ' of type ' + typeof raw));
            }
        }
        catch (e) {
            reject(e);
        }
    });
}

// Message serialization and parsing
const parseMessageString = (string: string): [Request|Response|Notification, number] => {
    var [head, ...body] = string.split("\r\n\r\n");
    var [message, seq] = parseHead(head);

    // Read body
    if (body instanceof Array && body.length > 0) {
        var bodyString = body.join("\r\n");
        if (bodyString !== '') {
            try {
                message.body = JSON.parse(bodyString);
            }
            catch(e) {
                message.body = bodyString;
            }
        }
    }

    return [message, seq];
};

const parseMessageBuffer = (buffer: ArrayBuffer): [Request|Response|Notification, number] => {
    var string = '', buffer_length = buffer.byteLength, i = 0, new_buffer: ArrayBuffer = null;
    var buffer_view = new Uint8Array(buffer);
    while (i < buffer_length) {
        var b0: number = buffer_view[i], b1 = buffer_view[i+1], b2 = buffer_view[i+2], b3 = buffer_view[i+3];
        if ((b0 & 0x80) === 0) {
            string += String.fromCharCode(b0);
            i += 1;
        }
        else if ((b0 & 0xE0) === 0xC0) {
            string += String.fromCharCode( (b0 << 6) + (b1 & 0x3F) );
            i += 2;
        }
        else if ((b0 & 0xF0) === 0xE0) {
            string += String.fromCharCode( (b0 << 12) + ((b1 & 0x3F) << 6) + (b2 & 0x3F) );
            i += 3;
        }
        else if ((b0 & 0xF8) === 0xF0) {
            string += String.fromCharCode( (b0 << 18) + ((b1 & 0x3F) << 12) + ((b2 & 0x3F) << 6) + (b3 & 0x3F) );
            i += 4;
        }
        else {
            throw new Error('UTF-8 Encoding error!');
        }

        if (string.length >= 4 && string.substring(string.length - 4) === "\r\n\r\n") {
            break;
        }
    }
    if (i < buffer_length) {
        new_buffer = buffer_view.subarray(i);
    }
    var [message, seq] = parseHead(string);
    message.body = new_buffer;

    return [message, seq];
};

const parseHead = (string: string): [Request|Response|Notification, number] => {
    let message: Request|Response|Notification = null, seq: number = 0;
    let [firstLine, ...headers] = string.split("\r\n");
    let [identifier, ..._] = firstLine.split(" ");

    if (Methods.indexOf(identifier) >= 0) {
        [message, seq] = parseRequestHead(firstLine);
    } else if (Statuses.indexOf(identifier) >= 0) {
        [message, seq] = parseResponseHead(firstLine);
    } else if (Events.indexOf(identifier) >= 0) {
        message = parseNotificationHead(firstLine);
    } else {
        throw new Error("Type of message unknown: " + identifier);
    }

    message.header = parseHeaders(headers);
    return [message, seq];
};

const parseRequestHead = (requestLine: string): [Request, number] => {
    const [method, resource, seqString] = requestLine.split(" ");
    const seq = parseInt(seqString, 10);
    let request = { method: (method as Method) , resource };
    return [request, seq];
}

const parseResponseHead = (responseLine: string): [Response, number] => {
    const [status, codeString, seqString] = responseLine.split(" ");
    const code = parseInt(codeString, 10);
    const seq = parseInt(seqString, 10);
    let response = { status: (status as Status), code };
    return [response, seq];
}

const parseNotificationHead = (notificationLine: string): Notification => {
    const [event, resource] = notificationLine.split(" ");
    let notification = { event: (event as Event), resource };
    return notification;
}

const parseHeaders = (headerLines: string[]): Header => {
    let header: Header = {};
    for (let headLine of headerLines) {
        if (headLine === "") {
            break;
        }
        let [key, value] = headLine.split(": ");
        header[key] = value;
    }
    return header;
}