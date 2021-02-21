import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { fetchApp } from "../../../actions/appsActions";
import { changeAppState } from '../../../actions/appStateActions';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
class AppIcon extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.iconClicked = this.iconClicked.bind(this);
  }

  render() {
    return (
      <div className="app-icon">
        <div
          style={{ backgroundColor: this.props.color || '#1abc9c' }}
          id={`icon-${ this.props.id }`}>
          <FontAwesomeIcon icon={ Icons[this.props.icon || 'faMobile'] } />
        </div>
        <footer>
          { this.props.title || 'application' }
        </footer>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(`icon-${ this.props.id }`)
      .addEventListener('click', this.iconClicked);
  }

  iconClicked() {

    let state;
    this.props.type === 'downloaded'
      ? state = 'clicked'
      : state = 'opened';

    /* change app state */
    const appState = {
      state,
      id: this.props.id,
      type: this.props.type,
    }
    this.props.changeAppState(appState);

    if (this.props.type !== 'downloaded') { return; }

    /* fetch app if it isn`t downloaded */
    const app = this.props.apps.find(app => app.id === this.props.id);
    !app && this.props.fetchApp(this.props.id);
  }

  componentWillUnmount() {
    document.getElementById(`icon-${ this.props.id }`)
      .removeEventListener('click', this.iconClicked);
  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* downloaded apps */
    apps: store.apps.data,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchApp: (appId) => {
      dispatch(fetchApp(appId))
    },
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppIcon);