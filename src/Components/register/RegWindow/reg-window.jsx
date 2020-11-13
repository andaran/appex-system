/* React */
import React from 'react';

/* Styles */
import './reg-window.sass';

/* Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

/* Component */
export default class RegWindow extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      errs: ['', '', '', ''],
    }

    // bind
    this.btnClicked = this.btnClicked.bind(this);
  }

  render() {

    let errs = [null, null, null, null];
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
            <input type="text" placeholder="пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faEnvelope } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="почта" id="reg-email" className="reg-window__input"/>
          </div>
        </div>
        { errs[2] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faKey } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="ключ" id="reg-key" className="reg-window__input"/>
          </div>
        </div>
        { errs[3] }
        <div className="reg-window__input-item">
          <div className="reg-window__button" id="reg-btn"> 
            Зарегистрироваться!
          </div>
        </div>
        <div className="reg-window__under-text">
          Уже Зарегистрированны? <Link to="/log"> Войти </Link>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById('reg-btn').addEventListener('click', this.btnClicked);
    document.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.btnClicked();
      }
    });
  }

  btnClicked() {
    /* Clear warnings */
    this.setState({
      errs: ['', '', '', '']
    });

    const username = document.getElementById('reg-username').value;
    if (false) {
      this.setState({
        errs: ['Такой пользователь уже есть в системе!', '', '', '']
      });
      return;
    }
    if (username.length < 3) {
      this.setState({
        errs: ['Слишком короткое имя пользователя!', '', '', '']
      });
      return;
    }

    const password = document.getElementById('reg-password').value;
    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)) {
      this.setState({
        errs: ['', 'Слишком легкий пароль!', '', '']
      });
      return;
    }

    const email = document.getElementById('reg-email').value;
    if (!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(email)) {
      this.setState({
        errs: ['', '', 'Неверно введен email адрес!', '']
      });
      return;
    }

    const code = document.getElementById('reg-key').value;
    if (!/[0-9a-zA-Z!@#$%^&*]{8}/.test(code)) {
      this.setState({
        errs: ['', '', '', 'Неверный формат кода! Он должен прийти вам на почту.']
      });
      return;
    } 
  }
} 