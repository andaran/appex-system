import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faUser} from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    let errs = [null, null, null];

    return (
      <div className="reg-window">
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="старый пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="новый пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faLock } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="повторите пароль" id="reg-password" className="reg-window__input"/>
          </div>
        </div>
        { errs[3] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_blue" id="reg-btn">
            Сменить пароль!
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
}