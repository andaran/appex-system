import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

/* Component */
export default class GroupsBlock extends React.Component {
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
            <FontAwesomeIcon icon={ faLayerGroup } />
          </div>
          <div className="reg-window__item-block">
            <input type="text"
                   placeholder="имя группы"
                   id={`group-name-${ this.props.number }`}
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
                   id={`group-description-${ this.props.number }`}
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
    const name = document.getElementById(`group-name-${ this.props.number }`);
    const des = document.getElementById(`group-description-${ this.props.number }`);

    name.value = this.props.name || '';
    des.value = this.props.description || '';
  }

  send() {

    /* clear errs */
    this.setState({
      errs: ['']
    });

    const name = document.getElementById(`group-name-${ this.props.number }`).value;
    const description = document.getElementById(`group-description-${ this.props.number }`).value;

    if (!name || !description) {
      return this.setState({
        errs: ['Введите недостающие значения!']
      });
    }

    let newUserSettings = JSON.stringify(this.props.user.userSettings);
    newUserSettings = JSON.parse(newUserSettings);
    newUserSettings.groups[this.props.number] = {
      name, description,
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
    newUserSettings.groups.splice(this.props.number, 1);

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