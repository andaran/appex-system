import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faUser, faAt, faIdBadge, faUserTag} from "@fortawesome/free-solid-svg-icons";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.deleteAccount = this.deleteAccount.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  render() {

    let errs = [null];
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
      <div className="apps-settings-wrap">
        <div className="reg-window">
          <div className="app-block">
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faUser } />
              </div>
              <div className="reg-window__item-block">
                <input type="text" className="reg-window__input" value={ this.props.user.username } readOnly={true}/>
              </div>
            </div>
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faAt } />
              </div>
              <div className="reg-window__item-block">
                <input type="text" className="reg-window__input" value={ this.props.user.email} readOnly={true}/>
              </div>
            </div>
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faIdBadge } />
              </div>
              <div className="reg-window__item-block">
                <input type="text" className="reg-window__input" value={ this.props.user.id } readOnly={true}/>
              </div>
            </div>
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faUserTag } />
              </div>
              <div className="reg-window__item-block">
                <input type="text" className="reg-window__input" value={ this.props.user.type } readOnly={true}/>
              </div>
            </div>
          </div>
          <div className="app-block">
            <div className="reg-window__input-item">
              <div className="reg-window__button reg-window__button_blue" onClick={ this.logOut }>
                Выйти из аккаунта
              </div>
            </div>
          </div>
          <div className="app-block">
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faTrashAlt } />
              </div>
              <div className="reg-window__item-block">
                <input type="text" placeholder="введите слово 'удалить'" id="test-word" className="reg-window__input"/>
              </div>
            </div>
            <div className="reg-window__input-item">
              <div className="reg-window__button reg-window__button_red" onClick={ this.deleteAccount }>
                Удалить аккаунт
              </div>
            </div>
          </div>
          { errs[0] }
        </div>
      </div>
    );
  }

  deleteAccount = () =>  {
    const word = document.getElementById('test-word').value;
    if (word === 'удалить') {
      this.send('/api/delete_user');
    } else {
      this.setState({
        errs: ["Введите слово 'удалить'"]
      });
    }
  }

  logOut = () => this.send('/api/log_out');

  send(url) {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    /* do request */
    request(url, {})
      .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.props.fetchUser();
        } else {
          console.log(body);
          this.setState({
            errs: ['Ошибка!']
          });
        }
      }).catch(err => {
        this.setState({
          errs: ['Ошибка запроса!']
        });
      });
  }
}