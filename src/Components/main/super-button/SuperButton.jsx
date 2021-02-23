import React from 'react';

import { changeAppState } from "../../../actions/appStateActions";
import { connect } from "react-redux";

import { app } from '../../../socketCore';

/* Component */
class SuperButton extends React.Component {
  constructor(props) {
    super(props);


    // bind
  }

  render() {

    return (
      <div className="super-button" id="super-button">button</div>
    );
  }

  componentDidMount() {

  }

  touchStart(event) {

  }

  touchEnd(event) {

  }

  touchMove(event) {

  }

  componentWillUnmount() {

  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* app state */
    appState: store.appState.state,
    appId: store.appState.id,
    appType: store.appState.type,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperButton);