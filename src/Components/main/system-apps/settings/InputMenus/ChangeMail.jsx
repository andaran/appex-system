import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faKey, faPaperPlane, faUser} from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailCode: false,
    }

  }

  render() {

    let codeButton = null;
    if (!this.state.emailCode) {
      codeButton = (
        <div className="reg-window__input-button" id="send-code-button">
          <FontAwesomeIcon icon={ faPaperPlane } />
        </div>
      );
    }

    let errs = [null, null]

    return (
      <div className="reg-window">
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faEnvelope } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="почта" id="reg-email" className="reg-window__input"/>
            { codeButton }
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <FontAwesomeIcon icon={ faKey } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="ключ" id="reg-key" className="reg-window__input"/>
          </div>
        </div>
        { errs[1] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_blue">
            Сменить почту!
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