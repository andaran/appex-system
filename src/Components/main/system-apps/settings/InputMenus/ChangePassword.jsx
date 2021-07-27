import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: ['', '', ''],
    }

    // bind
    this.send = this.send.bind(this);
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
      <div className="reg-window">
        <div className="app-block">
          <div className="reg-window__input-item">
            <div className="reg-window__item-block">
              <FontAwesomeIcon icon={ faLock } />
            </div>
            <div className="reg-window__item-block">
              <input type="text" placeholder="старый пароль" id="old-password" className="reg-window__input"/>
            </div>
          </div>
          { errs[0] }
          <div className="reg-window__input-item">
            <div className="reg-window__item-block">
              <FontAwesomeIcon icon={ faLock } />
            </div>
            <div className="reg-window__item-block">
              <input type="text" placeholder="новый пароль" id="new-password" className="reg-window__input"/>
            </div>
          </div>
          { errs[1] }
          <div className="reg-window__input-item">
            <div className="reg-window__item-block">
              <FontAwesomeIcon icon={ faLock } />
            </div>
            <div className="reg-window__item-block">
              <input type="text" placeholder="повторите пароль" id="repeat-password" className="reg-window__input"/>
            </div>
          </div>
          { errs[2] }
          <div className="reg-window__input-item">
            <div className="reg-window__button reg-window__button_blue" onClick={ this.send }>
              Сменить пароль!
            </div>
          </div>
        </div>
      </div>
    );
  }

  send() {

    /* Clear warnings */
    this.setState({
      errs: ['', '', '']
    });

    const oldPassword = document.getElementById('old-password').value;
    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(oldPassword)) {
      this.setState({
        errs: ['Неверный старый пароль!', '', '']
      });
      return;
    }

    const newPassword = document.getElementById('new-password').value;
    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(newPassword)) {
      this.setState({
        errs: ['', 'Слишком легкий пароль!', '']
      });
      return;
    }

    const repeatPassword = document.getElementById('repeat-password').value;
    if (newPassword !== repeatPassword) {
      this.setState({
        errs: ['', '', 'Пароли не совпадают!']
      });
      return;
    }

    this.changePassword({ newPassword, oldPassword });
  }

  changePassword(passwords) {
    request(`/api/change_password`, { ...passwords })
      .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.props.fetchUser();
        } else if (body.message === 'not coincide') {
          console.log(body);
          this.setState({
            errs: ['Неверный старый пароль!', '', '']
          });
        } else {
          console.log(body);
          this.setState({
            errs: ['Ошибка смены пароля!', '', '']
          });
        }
      }).catch(err => {
        this.setState({
          errs: ['Ошибка запроса!', '', '']
        });
      });
  }
}