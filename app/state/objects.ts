import fosp from '../../lib/fosp/fosp';

const GET_REQUEST = 'GET_REQUEST', GET_SUCCEEDED = 'GET_SUCCEEDED', GET_FAILED = 'GET_FAILED';

const LOADED = 'LOADED', LOADING = 'LOADING', LOADING_FAILED = 'LOADING_FAILED';

export function maybeGet(url: string) {
    return (dispatch, getState) => {
        let state = getState();
        let object = state.objects[url] || {};

        if (object.$state !== LOADED && object.$state !== LOADING) {
            dispatch(get(url));

            fosp.get(url)
                .then((object) => dispatch(getSucceeded(url, object)))
                .catch((e) => dispatch(getFailed(url, e)));
        }
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
    default:
        return state;
    }
}