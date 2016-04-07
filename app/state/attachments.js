import fosp from '../../lib/fosp/fosp';
import { getSucceeded } from './objects';

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
                fosp.get(url)
                    .then((object) => {
                        dispatch(getSucceeded(url, object));
                        readWithObject(dispatch, url, object);
                    })
                    .catch((e) => dispatch(readFailed(url, e)))
            } else {
                readWithObject(dispatch, url, object)
            }
        }
    }
}

function readWithObject(dispatch, url, object) {
    fosp.read(url)
        .then((buffer) => {
            let blob = new Blob([buffer], { type: object.attachment.type });
            dispatch(readSucceeded(url, blob));
        })
        .catch((e) => dispatch(readFailed(url, e)))
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