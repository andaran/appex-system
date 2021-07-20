import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faIdBadge, faKey, faLayerGroup, faPaperPlane, faUser} from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }
  }

  render() {
    return (
        <div className="reg-window">
          <div className="app-block user-settings-block">
            <header> Тема: </header>
            <div className="theme" id="theme-choice">
              <section onClick={() => this.setTheme(1)}/>
              <section onClick={() => this.setTheme(2)}/>
              <section onClick={() => this.setTheme(3)}/>
              <section onClick={() => this.setTheme(4)}/>
            </div>
          </div>
        </div>
    );
  }

  componentDidMount() {
    this.viewTheme();
  }

  viewTheme() {
    const theme = this.props.user.userSettings.theme;
    if (!theme) { return; }
    document.getElementById('theme-choice')
        .querySelector(`section:nth-child(${ theme })`)
        .classList.add('active');
  }

  setTheme(number) {

    const userSettings = this.props.user.userSettings;
    userSettings.theme = number;

    return request(`/api/change_user`, { userSettings })
     .then(res => res.json()).then(body => {
       if (body.status === 'ok') {
         this.props.fetchUser();
       } else {
         alert('Ошибка запроса :(');
       }
     }).catch(err => {
       alert('Ошибка запроса :(');
     });
  }
}