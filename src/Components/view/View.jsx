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

/* Component */
class View extends React.Component {
  constructor(props) {
    super(props);

    /* find app id and devMode */
    let id = window.location.href.split('/');
    this.id = id[id.length - 1].split('?devMode=')[0];
    let devMode = id[id.length - 1].split('?devMode=')[1];
    devMode === 'false'
      ? this.devMode = false
      : this.devMode = true;

  }

  render() {

    /* find app */
    if (this.props.projects.length !== 0) {
      this.app = this.props.projects.find(elem => elem.id === this.id);
    } else {
      this.app = false;
    }

    /* if app isn`t being */
    if(!this.app) {
      return (
        <Error/>
      );
    }

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <FontAwesomeIcon icon={ faPlay } style={{ display: 'none'}}/>
        <Interpreter
          app = { this.app }
          id="interpreter-mobile"
          devMode={ this.devMode }
          user={ this.props.user }
          appId={ this.id }/>
      </div>
    );
  }

  componentDidMount() {

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
