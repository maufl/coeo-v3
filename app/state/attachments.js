import fosp from '../../lib/fosp/fosp';
import { getSucceeded, update } from './objects';

const READ_REQUEST = 'READ_REQUEST',
      READ_SUCCEEDED = 'READ_SUCCEEDED',
      READ_FAILED = 'READ_FAILED';

const LOADED = 'LOADED', LOADING = 'LOADING', LOADING_FAILED = 'LOADING_FAILED';

export function maybeRead(url) {
    return (dispatch, getState) => {
        let state = getState();
        let object = state.objects[url];
        let attachment = state.attachments[url];

        if (!attachment || attachment.$state === LOADING_FAILED) {
            if (!object) {
                return fosp.get(url)
                    .then((object) => {
                        dispatch(getSucceeded(url, object));
                        return readWithObject(dispatch, url, object);
                    })
                    .catch((e) => { dispatch(readFailed(url, e)); throw e })
            } else {
                return readWithObject(dispatch, url, object);
            }
        }
        return Promise.resolve();
    }
}

export function write(url, file) {
    return (dispatch) => {
        let reader = new FileReader(), resolve, reject, promise = new Promise((rs, rj) => { resolve = rs, reject = rj });
        reader.onload = () => {
            fosp.write(url, reader.result)
                .then(() => dispatch(readSucceeded(url, file)))
                .then(() => dispatch(update(url, { attachment: { name: file.name, size: file.size, type: file.type }})))
                .then(() => resolve())
                .catch((e) => reject(e))
        };
        reader.onerror = (error) => { console.log(error) };
        reader.readAsArrayBuffer(file);
        return promise;
    }
}

function readWithObject(dispatch, url, object) {
    return fosp.read(url)
        .then((buffer) => {
            let blob = new File([buffer], object.attachment.name, { type: object.attachment.type });
            dispatch(readSucceeded(url, blob));
        })
        .catch((e) => { dispatch(readFailed(url, e)); throw e })
}

function read(url) {
    return {
        type: READ_REQUEST,
        url
    }
}

function readSucceeded(url, blob) {
    return {
        type: READ_SUCCEEDED,
        url,
        blob
    }
}

function readFailed(url, reason) {
    return {
        type: READ_FAILED,
        url,
        reason
    }
}

export function attachments(state = {}, action) {
    switch (action.type) {
    case READ_REQUEST:
        return Object.assign({}, state, {
            [action.url]: {
                $state: LOADING
            }
        });
    case READ_SUCCEEDED:
        return Object.assign({}, state, {
            [action.url]: {
                $state: LOADED,
                blob: action.blob,
                url: URL.createObjectURL(action.blob)
            }
        });
    case READ_FAILED:
        return Object.assign({}, state, {
            [action.url]: {
                $state: LOADING_FAILED,
                $reason: action.reason
            }
        });
    default:
        return state;
    }
}