import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
class AppIcon extends React.Component {
  constructor(props) {
    super(props);
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppIcon);