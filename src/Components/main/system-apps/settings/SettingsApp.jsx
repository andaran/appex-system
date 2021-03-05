import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faAt, faUserSlash, faMobile } from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class SettingsApp extends React.Component {

  render() {

    return (
      <div className="main-settings-wrap">
        <div className="main-settings-title">Настройки</div>
        <ul className="settings-list">
          <li className="apps-params">
            <FontAwesomeIcon icon={ faUser } style={{ color: '#1abc9c' }}/>
            <span> Сменить имя пользователя </span>
            <div/>
          </li>
          <li className="apps-params">
            <FontAwesomeIcon icon={ faLock } style={{ color: '#3498db' }}/>
            <span> Сменить пароль </span>
            <div/>
          </li>
          <li className="apps-params">
            <FontAwesomeIcon icon={ faAt } style={{ color: '#e67e22' }}/>
            <span> Сменить почту </span>
            <div/>
          </li>
          <li className="apps-params">
            <FontAwesomeIcon icon={ faUserSlash } style={{ color: '#e74c3c' }}/>
            <span> Удалить аккаунт </span>
            <div/>
          </li>
        </ul>
        <hr className="settings-line"/>
        <ul className="settings-list">
          <li className="apps-params">
            <FontAwesomeIcon icon={ faMobile } style={{ color: '#9b59b6' }}/>
            <span> Настройки приложений </span>
            <div/>
          </li>
        </ul>
      </div>
    );
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
}