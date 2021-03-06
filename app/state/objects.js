import fosp from '../../lib/fosp/fosp';
import { list }  from './children';

const GET_REQUEST = 'GET_REQUEST', GET_SUCCEEDED = 'GET_SUCCEEDED', GET_FAILED = 'GET_FAILED';
const UPDATED = 'UPDATED';
const CREATED = 'CREATED';

const LOADED = 'LOADED', LOADING = 'LOADING', LOADING_FAILED = 'LOADING_FAILED';

export function maybeGet(url) {
    return (dispatch, getState) => {
        let state = getState();
        let object = state.objects[url] || {};

        if (object.$state !== LOADED && object.$state !== LOADING) {
            dispatch(get(url));

            return fosp.get(url)
                       .then((object) => { dispatch(getSucceeded(url, object)); return object })
                       .catch((e) => { dispatch(getFailed(url, e)); throw e });
        }
    }
}

export function update(url, object) {
    return (dispatch) => {
        return fosp.patch(url, object)
                   .then((object) => { dispatch(updated(url, object)); return object })
    }
}

export function create(url, object) {
    return (dispatch) => {
        return fosp.create(url, object)
                   .then((object) => {
                       let parent = url.split('/').slice(0, -1).join('/');
                       dispatch(created(url, object));
                       dispatch(list(parent));
                       return object;
                   })
    }
}

function get(url) {
    return {
        type: GET_REQUEST,
        url
    }
}

export function getSucceeded(url, object) {
    return {
        type: GET_SUCCEEDED,
        url,
        object
    }
}

function getFailed(url, reason) {
    return {
        type: GET_FAILED,
        url,
        reason
    }
}

function updated(url, object) {
    return {
        type: UPDATED,
        url,
        object
    }
}

function created(url, object) {
    return {
        type: CREATED,
        url,
        object
    }
}

export function objects(state = {}, action) {
    switch (action.type) {
    case GET_REQUEST:
        return Object.assign({}, state, {
            [action.url]: {
                $state: LOADING
            }
        });
    case GET_SUCCEEDED:
        return Object.assign({}, state, {
            [action.url]: Object.assign({}, action.object, {
                $state: LOADED
            })
        });
    case GET_FAILED:
        return Object.assign({}, state, {
            [action.url]: {
                $state: LOADING_FAILED,
                $reason: action.reason
            }
        });
    case UPDATED:
        var object = Object.assign({}, action.object, {
            $state: LOADED
        });
        return Object.assign({}, state, {
            [action.url]: object
        })
    case CREATED:
        var object = Object.assign({}, action.object, {
            $state: LOADED
        });
        return Object.assign({}, state, {
            [action.url]: object
        })
    default:
        return state;
    }
}