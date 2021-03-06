import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errs: [''],
    }

    // bind
    this.send = this.send.bind(this);
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
          <div className="reg-window__button reg-window__button_blue" onClick={ this.send }>
            Сменить имя пользователя!
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

  }

  async send() {

    /* Clear warnings */
    this.setState({
      errs: ['']
    });

    const username = document.getElementById('reg-username').value;
    if (username.length < 3) {
      this.setState({
        errs: ['Слишком короткое имя пользователя!']
      });
      return;
    } else {

      /* checking username available */
      const body = JSON.stringify({ username });
      await fetch('/sign_up/is_param_available', {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body
      }).then(res => res.text()).then(text => {
        if (text === 'used') {
          this.setState({
            errs: ['Такой пользователь уже есть в системе!']
          });
          return;
        } else if (text === 'available') {
          this.changeUsername(username);
        } else {
          console.log('Ahtung in checking username!');
        }
      }).catch(err => console.log('Ahtung in checking username!', new Error(err)));
    }
  }

  changeUsername(username) {

  }

  componentWillUnmount() {

  }
}