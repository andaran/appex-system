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
      errs: ['', '', '', ''],
      emailCode: false,
      password: '',
      email: '',
      username: '',
      code: '',
      codeID: '',
    }

    // bind
    this.btnClicked = this.btnClicked.bind(this);
    this.hotkey = this.hotkey.bind(this);
    this.sendCode = this.sendCode.bind(this);
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

    let codeButton = null;
    if (!this.state.emailCode) {
      codeButton = (
        <div className="reg-window__input-button" id="send-code-button">
          <FontAwesomeIcon icon={ faPaperPlane } />
        </div>
      );
    }

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
            <FontAwesomeIcon icon={ faEnvelope } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="почта" id="reg-email" className="reg-window__input"/>
            { codeButton }
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faKey } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="ключ" id="reg-key" className="reg-window__input"/>
          </div>
        </div>
        { errs[2] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="новый пароль" id="reg-new-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[3] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_green" id="reg-btn">
            Сменить пароль!
          </div>
        </div>
        <div className="reg-window__under-text">
          Введите логин и email. На него вам придет код для создания нового пароля.
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
    if (!this.state.emailCode) {
      document.getElementById('send-code-button').addEventListener('click', this.sendCode);
    }
  }

  componentWillUnmount() {
    document.getElementById('reg-btn').removeEventListener('click', this.btnClicked);
    document.removeEventListener('keydown', this.hotkey);
    if (!this.state.emailCode) {
      document.getElementById('send-code-button').removeEventListener('click', this.sendCode);
    }
  }

  hotkey(event) {
    if (event.key === 'Enter') {
      this.btnClicked();
    }
  }

  async btnClicked() {

    /* Clear warnings */
    this.setState({
      errs: ['', '', '', '']
    });

    const username = document.getElementById('reg-username').value;
    if (username.length < 3) {
      this.setState({
        errs: ['Слишком короткое имя пользователя!', '', '', '']
      });
      return;
    } else {

      /* checking username available */
      const body = JSON.stringify({ username });
      await fetch('/sign_up/is_param_available', {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body
      }).then(res => res.text()).then(text => {
        if (text !== 'used') {
          this.setState({
            errs: ['Такого пользователя нет в системе!', '', '', '']
          });
          return;
        } else { this.setState({ username }); }
      }).catch(err => console.log('Ahtung in checking username!', new Error(err)));
    }

    const password = document.getElementById('reg-new-password').value;
    if (!/[0-9a-z]{6,}/.test(password)) {
      this.setState({
        errs: ['', '', '', 'Слишком легкий пароль!']
      });
      return;
    } else { this.setState({ password }); }

    const email = document.getElementById('reg-email').value;
    if (!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(email)) {
      this.setState({
        errs: ['', 'Неверно введен email адрес!', '', '']
      });
      return;
    } else {

      /* checking email available */
      const body = JSON.stringify({ email });
      await fetch('/sign_up/is_param_available', {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body
      }).then(res => res.text()).then(text => {
        if (text !== 'used') {
          this.setState({
            errs: ['', 'Такого адреса нет в системе!', '', ''], emailCode: false
          });
          return;
        } else { this.setState({ email }); }
      }).catch(err => console.log('Ahtung in checking email!', new Error(err)));
    }

    const code = document.getElementById('reg-key').value;
    if (!/[0-9a-zA-Z]{8}/.test(code)) {
      this.setState({
        errs: ['', '', 'Неверный формат кода! Он должен прийти вам на почту.', '']
      });
      return;
    } else { this.setState({ code }); }

    /* if email code isn`t posted */
    if (this.state.email === '' || this.state.codeID === '' || !this.state.emailCode) {
      this.setState({
        errs: ['', '', 'Вы не отправили код!', '']
      });
      return;
    }

    /* if all data is here */
    if (this.state.username === '' || this.state.password === '') { return; }

    /* if all is ok */
    const body = JSON.stringify({
      username: this.state.username,
      newPassword: this.state.password,
      email: this.state.email,
      code: this.state.code,
      codeID: this.state.codeID,
    });

    fetch('/change_password/', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    }).then(response => response.text()).then(text => {
      switch (text) {
        case 'ok':
          console.log('ok!');
          document.location.href = '/sign_in';
          break;
        case 'invalidCode':
          this.setState({ errs: ['', '', 'Неправильный код!', ''] });
          break;
        case 'used':
          this.setState({ errs: ['Такие username или email уже существуют!', '', '', ''], emailCode: false });
          break;
        default:
          this.setState({ errs: ['Неизвестная ошибка :(', '', '', ''] });
          break;
      }
    });
  }

  sendCode() {
    const email = document.getElementById('reg-email').value;
    if (!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(email)) {
      this.setState({
        errs: ['', 'Неверно введен email адрес!', '', '']
      });
      return;
    }

    /* generate code and send email */
    const body = JSON.stringify({ email });
    fetch('/change_password/secure_code', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    }).then(res => res.json()).then(body => {
      if (body.status !== 'ok') {
        this.setState({
          errs: ['', '', 'Ошибка отправки кода. Попробуйте еще раз.', ''],
          emailCode: false,
        });
        return; }
      this.setState({ emailCode: true, email, codeID: body.codeID });
    });
  }
} 