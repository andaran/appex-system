import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faIdBadge, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class AppBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.send = this.send.bind(this);
  }

  render() {

    /* find settings */
    const id = this.props.id;
    const settings = this.props.user.settings.find(elem => elem.id === id);

    if (settings !== undefined) {
      this.roomId = settings.body.roomId;
      this.roomPass = settings.body.roomPass;
      this.category = settings.body.category;
    }

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
      <div className="app-block">
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <div className="app-block__icon" style={{ backgroundColor: this.props.color }}>
              <FontAwesomeIcon icon={ Icons[this.props.icon] }/>
            </div>
          </div>
          <div className="reg-window__item-block">
            <input type="text" readOnly={ true } value={ this.props.title } className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faIdBadge } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="id комнаты"
                   id={`room-id-${ this.props.id }`}
                   className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faKey } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="пароль комнаты"
                   id={`room-pass-${ this.props.id }`}
                   className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLayerGroup } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="группа"
                   id={`group-${ this.props.id }`}
                   className="reg-window__input"/>
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_green" id="reg-btn" onClick={ this.send }>
            Сохранить
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const id = document.getElementById(`room-id-${ this.props.id }`);
    const pass = document.getElementById(`room-pass-${ this.props.id }`);
    const category = document.getElementById(`group-${ this.props.id }`);

    id.value = this.roomId || '';
    pass.value = this.roomPass || '';
    category.value = this.category || '';
  }

  send() {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    const roomId = document.getElementById(`room-id-${ this.props.id }`).value;
    const roomPass = document.getElementById(`room-pass-${ this.props.id }`).value;
    const category = document.getElementById(`group-${ this.props.id }`).value;

    if (!roomId || !roomPass) {
      return this.setState({
        errs: ['Введите айди и пароль комнаты!']
      });
    }

    const id = this.props.id;
    const settings = this.props.user.settings.find(elem => elem.id === id);
    let newUserSettings = this.props.user.settings;

    /* change user settings */
    if (settings !== undefined) {
      newUserSettings = newUserSettings.map(setting => {
        if (setting.id === id) {
          return {
            id, body: {
              ...setting.body,
              roomId, roomPass, category
            }
          }
        } else { return setting; }
      });
    } else {
      newUserSettings.push({
        id, body: { roomId, roomPass, category }
      });
    }

    /* do request */
    this.userRequest({ settings: newUserSettings });
  }

  userRequest(params) {
    request(`/api/change_user`, params)
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