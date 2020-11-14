/*
 *  Main page of appex-system app
 *  Author: Andrey ( https://github.com/andaran )
 *  Development started on 11.11.2020 19:10
 *  
 */

/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* Components */
import Register from './Components/register/RegWrap/reg-wrap';
import Login from './Components/login/LogWrap/log-wrap'

/* Libraries */
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import {Provider} from 'react-redux';
import store from './store';

/* Styles */
import './Styles/style.sass';

/*   ---==== Render ====---   */

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to={ { pathname: "/reg" } }/>
        </Route>
        <Route exact path="/reg" component={ Register }/>
        <Route exact path="/log" component={ Login }/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();