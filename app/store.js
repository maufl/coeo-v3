import thunkMiddleware from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware, routerReducer, push } from 'react-router-redux'

import { session, LOGIN_SUCCESS } from './state/session';
import { objects } from './state/objects';
import { attachments } from './state/attachments';
import { children } from './state/children';

let reducers = combineReducers({
    session,
    objects,
    attachments,
    children,
    routing: routerReducer
});


let redirectAfterLogin = store => next => action => {
    const result = next(action);
    if (action.type === LOGIN_SUCCESS) {
        store.dispatch(push('/me'))
    }
    return result;
}

let logger = store => next => action => {
    console.log("Dispatching ", action);
    let result = next(action);
    console.log("New state is ", store.getState());
    return result;
}

export default createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware,
        redirectAfterLogin,
        logger,
        routerMiddleware(hashHistory)
    )
);
