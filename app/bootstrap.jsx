import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import store from './store';
import { responsiveListen } from './state/responsive';
import { Provider } from 'react-redux';
import { push } from 'react-router-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

store.dispatch(responsiveListen());
store.dispatch(push("/login"));

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(
        <Provider store={store}>
        {routes}
        </Provider>
        , document.getElementById('container'));
});
