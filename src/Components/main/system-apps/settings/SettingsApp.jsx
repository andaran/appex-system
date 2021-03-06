import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faLock, faAt, faUserSlash, faMobile, faArrowLeft, faTimes} from "@fortawesome/free-solid-svg-icons";

import { fetchUser } from "../../../../actions/userActions";
import { connect } from "react-redux";

/* input menus */
import ChangeUserName from './InputMenus/ChangeUserName';
import ChangeMail from './InputMenus/ChangeMail';
import ChangePassword from './InputMenus/ChangePassword';
import DeleteAccount from './InputMenus/DeleteAccount';
import AppsSettings from './InputMenus/AppsSettings';

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
        <ChangeUserName/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Сменить пароль</div>
        <ChangePassword/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Сменить почту</div>
        <ChangeMail/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Удалить аккаунт</div>
        <DeleteAccount/>
      </div>,
      <div className="input-menu">
        { closeButton }
        <div className="main-settings-title">Настройки приложений</div>
        <AppsSettings { ...this.props }/>
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
          <li className="apps-params" onClick={ () => this.setState({ menu: 3 }) }>
            <FontAwesomeIcon icon={ faUserSlash } style={{ color: '#e74c3c' }}/>
            <span> Удалить аккаунт </span>
            <div/>
          </li>
        </ul>
        <hr className="settings-line"/>
        <ul className="settings-list">
          <li className="apps-params" onClick={ () => this.setState({ menu: 4 }) }>
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

  close() { this.setState({ menu: false }); }

  componentWillUnmount() {

  }
}


function mapStateToProps(store) {
  return {
    user: store.userData.user,
    projects: store.projects.data,
    apps: store.apps.data,

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