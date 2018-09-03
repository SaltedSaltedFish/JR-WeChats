/**
 * Created by Thinkpad on 2017/6/2.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';
import './style/style.css';
import routes from './routes';
import { Provider } from 'react-redux';
import Store from './middlewares/configureStore';

import initReactFastclick from 'react-fastclick';

//initReactFastclick();

ReactDOM.render(
    <Provider store={Store}>
        <Router children={routes} />
    </Provider>,
    document.getElementById('root')
);