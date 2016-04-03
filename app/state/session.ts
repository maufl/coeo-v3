import fosp from '../../lib/fosp/fosp';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const OFFLINE = 'OFFLINE';
export const PENDING = 'PENDING';
export const ONLINE = 'ONLINE';
export const FAILURE = 'FAILURE';

export function login(user: string, password: string) {
    return (dispatch) => {
        dispatch(loginRequest(user, password));
        let [username, host] = user.split('@');
        fosp.open(host)
            .then(() => fosp.authenticate(user, password))
            .then((resp) => dispatch(loginSuccess(user, password)))
            .catch((error) => dispatch(loginFailure(user, error)));
    }
}

function loginRequest(user: string, password: string) {
    return {
        type: LOGIN_REQUEST,
        user,
        password
    }
}

function loginSuccess(user: string, password: string) {
    return {
        type: LOGIN_SUCCESS,
        user,
        password
    }
}

function loginFailure(user: string, reason: string) {
    return {
        type: LOGIN_FAILURE,
        user,
        reason
    }
}

export function session(state = { state: OFFLINE }, action): Object {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                state: PENDING,
                user: action.user,
                password: action.password
            }
        case LOGIN_SUCCESS:
            return {
                state: ONLINE,
                user: action.user,
                password: action.password
            }
        case LOGIN_FAILURE:
            return {
                state: FAILURE,
                user: action.user,
                reason: action.reason
            }
        default:
            return state;
    }
}
