import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    let errs = [ null, null, null];

    return (
      <div className="reg-window">
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
          <div className="reg-window__button reg-window__button_blue">
            Сменить имя пользователя!
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