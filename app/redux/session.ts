export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function login(username: string, password: string) {
    console.log(username, password);
    return {
        type: LOGIN,
        username,
        password
    }
}

export function loginSuccess(username: string, password: string) {
    return {
        type: LOGIN_SUCCESS,
        username,
        password
    }
}

export function loginFailure(username: string, reason: string) {
    return {
        type: LOGIN_FAILURE,
        username,
        reason
    }
}

export function session(state = {}, action): Object {
    switch (action.type) {
    case LOGIN:
        return {
            username: action.username,
            password: action.password
        }
    case LOGIN_SUCCESS:
        return {
            username: action.username,
            password: action.password
        }
    case LOGIN_FAILURE:
        return {
            username: action.username,
            reason: action.reason
        }
    default:
        return state;
    }
}
