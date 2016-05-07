import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import store from './store';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import ResponsiveProvider from './responsive_provider';

document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(
        <Provider store={store}>
        <ResponsiveProvider>
        {routes}
        </ResponsiveProvider>
        </Provider>
        , document.getElementById('container'));
});
