/* React */
import React from 'react';

/* Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faKey, faPaperPlane, faUnlock} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

/* Component */
export default class ChangePass extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      errs: ['', '', '', '', ''],
    }

    // bind
    this.btnClicked = this.btnClicked.bind(this);
    this.hotkey = this.hotkey.bind(this);
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
            <FontAwesomeIcon icon={ faUnlock } />
          </div>
          <div className="reg-window__item-block">
            <input type="password" placeholder="старый пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faEnvelope } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="почта" id="reg-email" className="reg-window__input"/>
            <div className="reg-window__input-button">
              <FontAwesomeIcon icon={ faPaperPlane } /> 
            </div>
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
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="новый пароль" id="reg-new-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[4] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_green" id="reg-btn">
            Сменить пароль!
          </div>
        </div>
        <div className="reg-window__under-text">
          Введите логин / пароль и email. На него вам придет код для создания нового пароля.
        </div>
        <div className="reg-window__under-text reg-window__under-text_not-first">
          Перейти на
          <Link to="/sign_in">страницу входа</Link>
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
      errs: ['', '', '', '', '']
    });

    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    /* username */
    if (username.length === 0 && password.length === 0) {
      this.setState({
        errs: ['Введите имя пользователя или пароль!', '', '', '', '']
      });
      return;
    }
    if (false) {
      this.setState({
        errs: ['Такой пользователь уже есть в системе!', '', '', '']
      });
      return;
    }

    /* password */
    if (password.length === 0 && username.length === 0) {
      this.setState({
        errs: ['', 'Введите пароль или имя пользователя!', '', '', '']
      });
      return;
    }

    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/.test(password) && username.length === 0) {
      this.setState({
        errs: ['', 'Слишком легкий пароль!', '', '', '']
      });
      return;
    }

    const email = document.getElementById('reg-email').value;
    if (!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(email)) {
      this.setState({
        errs: ['', '', 'Неверно введен email адрес!', '', '']
      });
      return;
    }

    const code = document.getElementById('reg-key').value;
    if (!/[0-9a-zA-Z!@#$%^&*]{8}/.test(code)) {
      this.setState({
        errs: ['', '', '', 'Неверный формат кода! Он должен прийти вам на почту.', '']
      });
      return;
    } 
  }
} 