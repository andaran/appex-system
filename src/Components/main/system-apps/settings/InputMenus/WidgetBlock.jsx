import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faIdBadge, faLayerGroup, faAlignLeft, faCode, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class WidgetBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.send = this.send.bind(this);
    this.delete = this.delete.bind(this);
  }

  render() {

    /* errs */
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
            <FontAwesomeIcon icon={ faIdBadge } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="id комнаты"
                   id={`room-id-${ this.props.number }`}
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
                   id={`room-pass-${ this.props.number }`}
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
                   id={`group-${ this.props.number }`}
                   className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faCode } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="свойство"
                   id={`prop-${ this.props.number }`}
                   className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faThermometerHalf } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="значок fontawesome"
                   id={`icon-${ this.props.number }`}
                   className="reg-window__input"/>
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faAlignLeft } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="наименование"
                   id={`title-${ this.props.number }`}
                   className="reg-window__input"/>
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_green" onClick={ this.send }>
            Сохранить
          </div>
        </div>
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_red" onClick={ this.delete }>
            Удалить
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const id = document.getElementById(`room-id-${ this.props.number }`);
    const pass = document.getElementById(`room-pass-${ this.props.number }`);
    const category = document.getElementById(`group-${ this.props.number }`);
    const property = document.getElementById(`prop-${ this.props.number }`);
    const icon = document.getElementById(`icon-${ this.props.number }`);
    const title = document.getElementById(`title-${ this.props.number }`);

    id.value = this.props.roomId || '';
    pass.value = this.props.roomPass || '';
    category.value = this.props.category || '';
    property.value = this.props.property || '';
    icon.value = this.props.icon || '';
    title.value = this.props.title || '';
  }

  send() {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    const roomId = document.getElementById(`room-id-${ this.props.number }`).value;
    const roomPass = document.getElementById(`room-pass-${ this.props.number }`).value;
    const category = document.getElementById(`group-${ this.props.number }`).value;
    const property = document.getElementById(`prop-${ this.props.number }`).value;
    const icon = document.getElementById(`icon-${ this.props.number }`).value;
    const title = document.getElementById(`title-${ this.props.number }`).value;

    if (!roomId || !roomPass || !category || !icon || !property) {
      return this.setState({
        errs: ['Введите недостающие значения!']
      });
    }

    let newUserSettings = JSON.stringify(this.props.user.userSettings);
    newUserSettings = JSON.parse(newUserSettings);
    newUserSettings.widgets[this.props.number] = {
      roomId, roomPass, category, property, icon, title,
    };

    /* do request */
    this.userRequest({ userSettings: newUserSettings });
  }

  delete() {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    let newUserSettings = JSON.stringify(this.props.user.userSettings);
    newUserSettings = JSON.parse(newUserSettings);
    newUserSettings.widgets.splice(this.props.number, 1);

    /* do request */
    this.userRequest({ userSettings: newUserSettings });
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