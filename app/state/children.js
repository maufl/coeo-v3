import fosp from '../../lib/fosp/fosp';

const LIST_REQUEST = 'LIST_REQUEST',
      LIST_SUCCEEDED = 'LIST_SUCCEEDED',
      LIST_FAILED = 'LIST_FAILED';

const LOADED = 'LOADED', LOADING = 'LOADING', LOADING_FAILED = 'LOADING_FAILED';

export function maybeList(url) {
    return (dispatch, getState) => {
        let state = getState();
        let children = state.children[url];

        if (!children || children.$state === LOADING_FAILED) {
            fosp.list(url)
                .then((children) => dispatch(listSucceeded(url, children.map(child => `${url}/${child}`))))
                .catch((e) => dispatch(listFailed(url, e)));
        }
    }
}

function list(url) {
    return {
        type: LIST_REQUEST,
        url
    }
}

function listSucceeded(url, children) {
    return {
        type: LIST_SUCCEEDED,
        url,
        children
    }
}

function listFailed(url, reason) {
    return {
        type: LIST_FAILED,
        url,
        reason
    }
}

export function children(state = {}, action) {
    switch (action.type) {
        case LIST_REQUEST:
            var list = [];
            list.$state = LOADING;
            return Object.assign({}, state, {
                [action.url]: list
            });
        case LIST_SUCCEEDED:
            var list = action.children;
            list.$state = LOADED;
            return Object.assign({}, state, {
                [action.url]: list
            });
        case LIST_FAILED:
            var list = [];
            list.$state = LOADING_FAILED;
            list.$reason = action.reason;
            return Object.assign({}, state, {
                [action.url]: list
            });
        default:
            return state;
    }
}
