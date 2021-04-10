/* React */
import React from 'react';

import Interpreter from "../../tools/interpreter/Interpreter";
import Error from "../projects/error-404/Error404";

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
    }

    /* find app id and devMode */
    this.id = this.props.location.pathname.split('/')[2];
    let devMode = this.props.location.search.split('?devMode=')[1];
    devMode === 'false'
      ? this.devMode = false
      : this.devMode = true;

  }

  render() {

    /* if app isn`t being */
    if(!this.state.app || !this.state.user) {
      return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white' }}/>
      );
    }

    console.log('\n\n   ---==== Запускаем! ====---   \n\n', this.state);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
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

    console.log('\n\n---=== VIEW_PROPS ===---\n\n', this.props);

    /* download app and user */
    if (!this.state.app) {
      request('/api/get_app', { appId: this.id })
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            this.setState({ app: body.app, user: body.user });
          } else {
            console.log('Ahtung in downloading app!');
          }
      }).catch(err => console.log('Ahtung in downloading app!'));
    }

    if (!this.devMode) { return; }

    /* connect to devRoom */
    connectToDevRoom(this.id);

    /* update appCode */
    socket.on('updateAppCode', data => {
      if (data.roomId === 'dev=' + this.id) {
        console.log('\nreload!\n');
        window.location.reload();
      }
    });
  }
}