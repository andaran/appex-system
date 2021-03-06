import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class AppBlock extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    /* find settings */
    const id = this.props.id;
    const settings = this.props.user.settings.find(elem => elem.id === id);

    if (settings !== undefined) {
      this.roomId = settings.body.roomId;
      this.roomPass = settings.body.roomPass;
    }

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
          <div className="reg-window__button reg-window__button_green" id="reg-btn">
            Сохранить
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const id = document.getElementById(`room-id-${ this.props.id }`);
    const pass = document.getElementById(`room-pass-${ this.props.id }`);

    console.log(this.props);

    id.value = this.roomId || '';
    pass.value = this.roomPass || '';
  }

  componentWillUnmount() {

  }
}