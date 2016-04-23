let DEBUG = true, WARN = true, ERROR = true, INFO = true;

export const debug = (msg: string, ...args) => {
    if (DEBUG)  {
        console.debug(msg, ...args);
    }
}

export const warn = (msg: string) => {
    if (WARN) {
        console.warn(msg);
    }
}

export const error = (msg: string) => {
    if (ERROR) {
        console.error(msg);
    }
}

export const info = (msg: string) => {
    if (INFO) {
        console.info(msg);
    }
}
