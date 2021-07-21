import React from 'react';

import WidgetBlock from './WidgetBlock';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faCode,
  faIdBadge,
  faKey,
  faLayerGroup,
  faThermometerHalf
} from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class Widgets extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.create = this.create.bind(this);
  }

  render() {

    if (this.props.user.userSettings.widgets === undefined) {
      this.props.user.userSettings.widgets = [];
    }

    /* widgets */
    let widgets = this.props.user.userSettings.widgets.map((widget, i) => {
      return <WidgetBlock { ...widget }
                       user={{ ...this.props.user }}
                       key={ i }
                       number={ i }
                       fetchUser={ this.props.fetchUser }/>;
    });

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
          { widgets }

          <div className="app-block">
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faIdBadge } />
              </div>
              <div className="reg-window__item-block">
                <input type="text"
                       placeholder="id комнаты"
                       id={`room-id-widget-create`}
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
                       id={`room-pass-widget-create`}
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
                       id={`group-widget-create`}
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
                       id={`prop-widget-create`}
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
                       id={`icon-widget-create`}
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
                       id={`title-widget-create`}
                       className="reg-window__input"/>
              </div>
            </div>
            { errs[0] }
            <div className="reg-window__input-item">
              <div className="reg-window__button reg-window__button_blue" onClick={ this.create }>
                Создать
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  create() {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    const roomId = document.getElementById('room-id-widget-create').value;
    const roomPass = document.getElementById('room-pass-widget-create').value;
    const category = document.getElementById('group-widget-create').value;
    const property = document.getElementById('prop-widget-create').value;
    const icon = document.getElementById('icon-widget-create').value;
    const title = document.getElementById('title-widget-create').value;

    if (!roomId || !roomPass || !category || !icon || !property) {
      return this.setState({
        errs: ['Введите недостающие значения!']
      });
    }

    let newUserSettings = JSON.stringify(this.props.user.userSettings);
    newUserSettings = JSON.parse(newUserSettings);
    newUserSettings.widgets.push({
      roomId, roomPass, category, property, icon, title,
    });

    /* do request */
    this.userRequest({ userSettings: newUserSettings });
  }

  userRequest(params) {
    request(`/api/change_user`, params)
      .then(res => res.json()).then(body => {
      if (body.status === 'ok') {
        this.props.fetchUser();
      } else {
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