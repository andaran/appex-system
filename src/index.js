/*
 *  Main page of appex-system app
 *  Author: Andrey ( https://github.com/andaran )
 *  Development started on 11.11.2020 19:10
 *  
 */

/* React */
import React from 'react';
import { createRoot } from 'react-dom/client';

/* Components */
import Register from './Components/register/RegWrap/reg-wrap';
import Login from './Components/login/LogWrap/log-wrap';
import ChangePass from './Components/change_pass/ChangePassWrap/change-pass-wrap';
import Projects from './Components/projects/projects-wrap/ProjectsWrap';
import ProjectPage from './Components/projects/project-page/ProjectPage';
import PrivateRoute from "./Components/additComponents/PrivateRoute";
import MainPage from './Components/main/main-page/MainPage';
import View from './Components/view/View';
import Lending from './Components/lending/Lending';
import DocsPage from './Components/docs/docs-page/DocsPage';
import Error404 from './Components/additComponents/Error404';

/* Libraries */
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';

/* Styles */
import './Styles/style.sass';



/*   ---==== Render ====---   */

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route exact path="/" element={ <Lending/> }/>
        <Route exact path="/sign_up" element={ <Register/> }/>
        <Route exact path="/sign_in" element={ <Login/> }/>
        <Route exact path="/change_password" element={ <ChangePass/> }/>
        <Route exact path="/view/:id" element={ <View/> }/>
        <Route exact path="/doc" element={ <DocsPage/> }/>
        <Route exact path="/projects" element={ <PrivateRoute> <Projects/> </PrivateRoute> }/>
        <Route exact path="/projects/:id" element={ <PrivateRoute> <ProjectPage/> </PrivateRoute> }/>
        <Route exact path="/main" element={ <PrivateRoute> <MainPage/> </PrivateRoute> }/>
        <Route element={ <Error404/> }/>
      </Routes>
    </Router>
  </Provider>
);



/*   ---==== Other features ====---   */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();