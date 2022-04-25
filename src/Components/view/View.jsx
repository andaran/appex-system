/* React */
import React from 'react';

import Interpreter from "../../tools/interpreter/Interpreter";
import Error from "../projects/error-404/Error404";
import Message from "../../tools/message/Message";

import { socket, connectToDevRoom } from '../../socketCore';

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { request } from "../../tools/apiRequest/apiRequest";

/* Component */
export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      app: false,
      user: false,
      err: false,
      errMessage: null,
    }

    /* find app id and devMode */
    this.id = window.location.pathname.split('/')[2];
    let devMode = window.location.search.split('?devMode=')[1];
    devMode === 'false'
      ? this.devMode = false
      : this.devMode = true;

  }

  render() {

    /* if app isn`t being */
    if((!this.state.app || !this.state.user) && !this.state.err) {
      return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white' }}/>
      );
    }

    /* any error */
    if(this.state.err) {
      return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <Message type={false}
                   text="Ошибка открытия приложения"
                   underText={ this.state.errMessage }
                   center={true}/>
        </div>
      );
    }

    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white' }}>
        <FontAwesomeIcon icon={ faPlay } style={{ display: 'none'}}/>
        <Interpreter
          app = { this.state.app }
          id="interpreter-mobile"
          devMode={ this.devMode }
          user={ this.state.user }
          appId={ this.id }/>
      </div>
    );
  }

  componentDidMount() {

    /* download app and user */
    if (!this.state.app) {
      let name = 'cache-';
      if (this.devMode) { name = 'update-'; }
      const app = JSON.parse(localStorage.getItem(name + this.id));
      const user = JSON.parse(localStorage.getItem('user'));

      if (app && user) {
        this.setState({ app, user });
      } else {
        request('/api/get_app', { appId: this.id })
          .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            this.setState({ app: body.app, user: body.user });
          } else {
            this.setState({ err: true, errMessage: body.message });
            console.log('Ahtung in downloading app!');
          }
        }).catch(err => {
          console.log('Ahtung in downloading app!');
          this.setState({ err: true, errMessage: 'Проверьте соединение с интернетом' });
        });
      }
    }

    if (!this.devMode) { return; }

    /* connect to devRoom */
    connectToDevRoom(this.id);

    /* update appCode */
    socket.on('updateAppCode', data => {
      if (data.roomId === 'dev=' + this.id) {
        window.location.reload();
      }
    });
  }
}