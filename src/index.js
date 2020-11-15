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
import Login from './Components/login/LogWrap/log-wrap';
import ChangePass from './Components/change_pass/ChangePassWrap/change-pass-wrap';
import Projects from './Components/projects/projects-wrap/ProjectsWrap';

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
          <Redirect to={ { pathname: "/sign_up" } }/>
        </Route>
        <Route exact path="/sign_up" component={ Register }/>
        <Route exact path="/sign_in" component={ Login }/>
        <Route exact path="/change_password" component={ ChangePass }/>
        <Route exact path="/projects" component={ Projects }/>
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