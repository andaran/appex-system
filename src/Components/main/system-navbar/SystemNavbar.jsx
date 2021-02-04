import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

/* Component */
class SystemNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="system-navbar">
        <div className="navbar__items navbar__items_small">
          <div className="navbar__item navbar__item_small">
            <Link className="navbar__link navbar__link_small" to="/projects"> Проекты </Link>
          </div>
          <div className="navbar__item navbar__item_small">
            <Link className="navbar__link navbar__link_small" to="/docs"> Документация </Link>
          </div>
          <div className="navbar__item navbar__item_small">
            <Link className="navbar__link navbar__link_small" to="/main"> Главная </Link>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SystemNavbar);