/* React */
import React from 'react';

import Interpreter from "../../tools/interpreter/Interpreter";
import Error from "../projects/error-404/Error404";
import {changeProjects, fetchProjects} from "../../actions/projectsActions";
import {switchModalState} from "../../actions/projectsModalActions";
import {changeAppState} from "../../actions/appStateActions";
import {connect} from "react-redux";

import { socket, connectToDevRoom } from '../../socketCore';

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { request } from "../../tools/apiRequest/apiRequest";

/* Component */
class View extends React.Component {
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
    if(!this.state.app) {
      return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white' }}/>
      );
    }

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

    console.log('\n\n\n---=== VIEW_PROPS ===---\n\n\n', this.props);

    /* download app */
    if (!this.state.app) {
      request('/api/get_app', { appId: this.id })
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            console.log('ok');
            console.log(body.app);
            this.setState({ app: body.app });
          } else {
            console.log('Ahtung in downloading app!');
          }
      }).catch(err => console.log('Ahtung in downloading app!'));
    }

    /* download user */
    if (!this.state.user) {
      request('/api/get_user', {})
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            console.log('ok');
            console.log(body.app);
            this.setState({ user: body.user });
          } else {
            console.log('Ahtung in downloading user!');
          }
      }).catch(err => console.log('Ahtung in downloading user!'));
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



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* projects */
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
    projectsError: store.projects.error,
    projectsFulfilled: store.projects.fulfilled,

    /* user */
    user: store.userData.user,

    /* app state */
    appState: store.appState.state,
    appId: store.appState.id,
    appType: store.appState.type,

    /* downloaded apps */
    apps: store.apps.data,

    /* modal */
    modal: store.projectsModal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    },
    changeProjects: ( changedProjects ) => {
      dispatch(changeProjects( changedProjects ))
    },
    switchModalState: (state, mode) => {
      dispatch(switchModalState(state, mode))
    },
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
