import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faLock, faAt, faUserCog, faMobile, faArrowLeft, faInfoCircle} from "@fortawesome/free-solid-svg-icons";

import { fetchUser } from "../../../../actions/userActions";
import { connect } from "react-redux";

/* input menus */
import ChangeUserName from './InputMenus/ChangeUserName';
import ChangeMail from './InputMenus/ChangeMail';
import ChangePassword from './InputMenus/ChangePassword';
import AccountInfo from './InputMenus/AccountInfo';
import AppsSettings from './InputMenus/AppsSettings';
import UserSettings from './InputMenus/UserSettings';

/* Component */
class SettingsApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
    }

    // bind
    this.close = this.close.bind(this);
  }

  render() {

    /* menu */
    const closeButton = <div className="super-button">
      <FontAwesomeIcon className="super-button__knob" onClick={ this.close } icon={ faArrowLeft }/>
    </div>;

    const allMenus = [
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Сменить имя пользователя</div>
        <ChangeUserName fetchUser={ this.props.fetchUser }/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Сменить пароль</div>
        <ChangePassword fetchUser={ this.props.fetchUser }/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Сменить почту</div>
        <ChangeMail fetchUser={ this.props.fetchUser }/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Настройки приложений</div>
        <AppsSettings { ...this.props } fetchUser={ this.props.fetchUser }/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Настройки пользователя</div>
        <UserSettings { ...this.props } fetchUser={ this.props.fetchUser }/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Об аккаунте</div>
        <AccountInfo { ...this.props } fetchUser={ this.props.fetchUser }/>
      </div>,
    ];

    let inputMenu = null;
    if (typeof this.state.menu === 'number') { inputMenu = allMenus[this.state.menu]; }

    return (
      <div className="main-settings-wrap">
        <div className={`input-menu-wrap input-menu-wrap_${ this.state.menu }`}>{ inputMenu }</div>
        <div className="main-settings-title">Настройки</div>
        <ul className="settings-list">
          <li className="apps-params" onClick={ () => this.setState({ menu: 0 }) }>
            <FontAwesomeIcon icon={ faUser } style={{ color: '#1abc9c' }}/>
            <span> Сменить имя пользователя </span>
            <div/>
          </li>
          <li className="apps-params" onClick={ () => this.setState({ menu: 1 }) }>
            <FontAwesomeIcon icon={ faLock } style={{ color: '#3498db' }}/>
            <span> Сменить пароль </span>
            <div/>
          </li>
          <li className="apps-params" onClick={ () => this.setState({ menu: 2 }) }>
            <FontAwesomeIcon icon={ faAt } style={{ color: '#e67e22' }}/>
            <span> Сменить почту </span>
            <div/>
          </li>
        </ul>
        <hr className="settings-line"/>
        <ul className="settings-list">
          <li className="apps-params" onClick={ () => this.setState({ menu: 3 }) }>
            <FontAwesomeIcon icon={ faMobile } style={{ color: '#9b59b6' }}/>
            <span> Настройки приложений </span>
            <div/>
          </li>
          <li className="apps-params" onClick={ () => this.setState({ menu: 4 }) }>
            <FontAwesomeIcon icon={ faUserCog } style={{ color: '#63cdda' }}/>
            <span> Настройки пользователя </span>
            <div/>
          </li>
        </ul>
        <hr className="settings-line"/>
        <ul className="settings-list">
          <li className="apps-params" onClick={ () => this.setState({ menu: 5 }) }>
            <FontAwesomeIcon icon={ faInfoCircle } style={{ color: '#2ecc71' }}/>
            <span> Об аккаунте </span>
            <div/>
          </li>
        </ul>
      </div>
    );
  }

  close() { this.setState({ menu: false }); }
}


function mapStateToProps(store) {
  return {
    user: store.userData.user,
    projects: store.projects.data,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsApp);