import { Message } from './message';
import { Request } from './request';
import { Response } from './response';
import { Notification } from './notification';

export const serializeMessage = (msg: (Request|Response|Notification), seq: number): (string|Uint8Array) => {
    let firstLine = '';
    if ('method' in msg) {
        let req = msg as Request;
        firstLine = [req.method, req.resource, seq].join(' ');
    } else if ('status' in msg) {
        let resp = msg as Response;
        firstLine = [resp.status, resp.code, seq].join(' ');
    } else if ('event' in msg) {
        let ntf = msg as Notification
        firstLine = [ntf.event, ntf.resource].join(' ');
    } else {
        throw new Error("Tried to serialize a message that is not a message");
    }

    let head = firstLine + "\r\n" + serializeHeaderToString(msg);

    // Serialize body to string
    let body = msg.body
    if (body instanceof ArrayBuffer) {
        // Serialize body to buffer
        var body_length = body.byteLength;
        if ( body_length > 0)
            head += "\r\n";
        var headUTF8Array = stringToUTF8Array(head), head_length = headUTF8Array.length;
        var serializedMessage = new Uint8Array(new ArrayBuffer(head_length + body_length));
        var body_view = new Uint8Array(body);
        for (var i = 0; i < head_length; i++) {
            serializedMessage[i] = headUTF8Array[i];
        }
        for (i = 0; i < body_length; i++) {
            serializedMessage[i+head_length] = body_view[i];
        }
        return serializedMessage;
    }

    return head + "\r\n" + serializeBodyToString(msg);
}
const serializeHeaderToString = (msg: Message): string  => {
  var raw = '';
  for (let k in msg.header) {
    raw += k + ": " + msg.header[k] + "\r\n";
  }
  return raw;
};

const serializeBodyToString = (msg: Message): string => {
  if (typeof msg.body !== 'undefined' && msg.body !== null)
    return JSON.stringify(msg.body);
  return '';
};

const stringToUTF8Array = (str: string): Array<number> => {
  var utf8: Array<number> = [];
  for (var i=0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
    }
    else {
      // let's keep things simple and only handle chars up to U+FFFF...
      utf8.push(0xef, 0xbf, 0xbd); // U+FFFE "replacement character"
    }
  }
  return utf8;
};