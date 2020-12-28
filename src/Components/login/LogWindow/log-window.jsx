/* React */
import React from 'react';

/* Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

/* Component */
export default class RegWindow extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      errs: ['', '', ''],
    }

    // bind
    this.btnClicked = this.btnClicked.bind(this);
    this.hotkey = this.hotkey.bind(this);
  }

  render() {

    let errs = [null, null, null];
    errs = errs.map((item, index) => {
      if (this.state.errs[index] !== '') {
        return (
          <div className="reg-window__err-item">
            { this.state.errs[index] }
          </div>
        );
      }
    });

    return (
      <div className="reg-window reg-window_center">
        <div className="reg-window__text-item">
          <img src="./images/appex.svg" alt="a" className="appex-logo"/>
          <span className="logo-text">ppex</span>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faUser } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="никнейм" id="reg-username" className="reg-window__input"/>
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="password" placeholder="пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_red" id="reg-btn"> 
            Войти!
          </div>
        </div>
        { errs[2] }
        <div className="reg-window__input-item">
          <div className="reg-window__under-text">
            Ещё не зарегистрировались? <Link to="/sign_up"> Регистрация </Link>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__under-text reg-window__under-text_not-first">
            Забыли пароль? <Link to="/change_password"> Восстановить </Link>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById('reg-btn').addEventListener('click', this.btnClicked);
    document.addEventListener('keydown', this.hotkey);
  }

  componentWillUnmount() {
    document.getElementById('reg-btn').removeEventListener('click', this.btnClicked);
    document.removeEventListener('keydown', this.hotkey);
  }

  hotkey(event) {
    if (event.key === 'Enter') {
      this.btnClicked();
    }
  }

  btnClicked() {

    /* Clear warnings */
    this.setState({
      errs: ['', '', '']
    });

    /* check username */
    const username = document.getElementById('reg-username').value;
    if (username.length === 0) {
      this.setState({
        errs: ['Введите имя пользователя!', '', '']
      });
      return;
    }

    /* check password */
    const password = document.getElementById('reg-password').value;
    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)) {
      this.setState({
        errs: ['', 'Неверный пароль!', '']
      });
      return;
    }

    /* send to the server */
    const body = JSON.stringify({
      username: username,
      password: password,
    });
    fetch('/sign_in/', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    }).then(response => response.json()).then(body => {
      if (body.status === 'ok') {
        console.log('ok');
      } else {
        this.setState({
          errs: ['', '', 'Неверный логин или пароль!']
        });
      }
    });
  }
} 