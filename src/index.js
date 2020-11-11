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

/* Libraries */

import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import {Provider} from 'react-redux';
import store from './store';

/*   ---==== Render ====---   */

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Nav/>
      <Switch>
        <Route exact path="/">
          <Main func = { null }/>
        </Route>
        <Route exact path="/articles" component={ Articles }/>
        <Route exact path="/articles/:articleID" component={ ArticlePage }/>
        <Route exact component={Error}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.unregister();