//Everything message related

export interface Header {
  [key: string]: string
}

export interface Message {
  header?: Header,
  body?: (Object|Blob)
}

export const headerToString = (header: Header) => {
    let parts = [];
    for (let key in header) {
        parts.push(`${key}: ${header[key]};`);
    }
    return parts.join(' ');
}

export const messageToString = (msg: Message) => `${headerToString(msg.header)} :: ${msg.body instanceof Blob ? '[binary data]' : JSON.stringify(msg.body)}`
