import fosp from '../../lib/fosp/fosp';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

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

export function signup(user, password) {
    return (dispatch) => {
        let [username, host] = user.split('@');
        fosp.open(host)
            .then(() => fosp.create(user, { data: { password } } ))
            .then(() => fosp.authenticate(user, password))
            .then(() => {
                return [
                    [user + "/soc", { acl: { others: { data: ["read"], children: ["read"]}}}],
                    [user + "/soc/me"],
                    [user + "/soc/me/motto"],
                    [user + "/soc/photos"],
                    [user + "/soc/photos/profile"],
                    [user + "/soc/photos/cover"],
                    [user + "/soc/feed"],
                    [user + "/soc/feed/blog"],
                    [`${user}/cfg`],
                    [user + "/cfg/groups"],
                    [user + "/cfg/groups/friends", { data: { name: "Friends", members: [] }}]
                ].reduce((promise, [path, object = {}]) => promise.then(() => fosp.create(path, object)), Promise.resolve());
            })
            .then(() => dispatch(signupSucceeded(user, password)))
            .catch((e) => dispatch(signupFailed(user, e)));
    }
}

function loginRequest() {
    return {
        type: LOGIN_REQUEST
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

function signupSucceeded(user, password) {
    return login(user, password);
}

function signupFailed(user, reason) {
    return {
        type: SIGNUP_FAILURE,
        user,
        reason
    }
}

export function session(state = { state: OFFLINE }, action): Object {
    switch (action.type) {
    case LOGIN_REQUEST:
        return {
            state: PENDING
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
    case SIGNUP_FAILURE:
        return {
            state: FAILURE,
            user: action.user,
            reason: action.reason
        }
    default:
            return state;
    }
}
