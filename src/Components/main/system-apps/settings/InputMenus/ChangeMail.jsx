import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faKey, faPaperPlane, faUser} from "@fortawesome/free-solid-svg-icons";
import {request} from "../../../../../tools/apiRequest/apiRequest";

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
            <FontAwesomeIcon icon={ faEnvelope } />
          </div>
          <div className="reg-window__item-block">
            <input type="text" placeholder="почта" id="reg-email" className="reg-window__input"/>
          </div>
        </div>
        { errs[0] }
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_blue" onClick={ this.send }>
            Сменить почту!
          </div>
        </div>
      </div>
    );
  }

  async send() {

    /* Clear warnings */
    this.setState({
      errs: ['']
    });

    const email = document.getElementById('reg-email').value;
    if (!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(email)) {
      this.setState({
        errs: ['Неверно введен email адрес!']
      });
      return;
    } else {

      /* checking username available */
      await request('/sign_up/is_param_available', { email })
        .then(res => res.text()).then(text => {
          if (text === 'used') {
            this.setState({
              errs: ['Такая почта уже есть в системе!']
            });
            return;
          } else if (text === 'available') {
            this.changeMail(email);
          } else {
            console.log('Ahtung in checking email!');
          }
        }).catch(err => console.log('Ahtung in checking email!', new Error(err)));
    }
  }

  changeMail(email) {
    return request(`/api/change_user_private`, { email })
      .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.props.fetchUser();
        } else {
          console.log(body);
          this.setState({
            errs: ['Ошибка смены почты!']
          });
        }
      }).catch(err => {
        this.setState({
          errs: ['Ошибка запроса!']
        });
      });
  }
}