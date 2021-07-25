import React from 'react';

import GroupsBlock from './GroupBlock';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faLayerGroup, faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class Groups extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.create = this.create.bind(this);
  }

  render() {

    if (this.props.user.userSettings.groups === undefined) {
      this.props.user.userSettings.groups = [];
    }

    /* widgets */
    let widgets = this.props.user.userSettings.groups.map((widget, i) => {
      return <GroupsBlock { ...widget }
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
                <FontAwesomeIcon icon={ faLayerGroup } />
              </div>
              <div className="reg-window__item-block">
                <input type="text"
                       placeholder="имя группы"
                       id={`group-name-create`}
                       className="reg-window__input"/>
              </div>
            </div>
            <div className="reg-window__input-item">
              <div className="reg-window__item-block">
                <FontAwesomeIcon icon={ faAlignLeft } />
              </div>
              <div className="reg-window__item-block">
                <input type="text"
                       placeholder="описание"
                       id={`group-description-create`}
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

    const name = document.getElementById(`group-name-create`).value;
    const description = document.getElementById(`group-description-create`).value;

    if (!name || !description) {
      return this.setState({
        errs: ['Введите недостающие значения!']
      });
    }

    let newUserSettings = JSON.stringify(this.props.user.userSettings);
    newUserSettings = JSON.parse(newUserSettings);
    newUserSettings.groups.push({
      name, description,
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