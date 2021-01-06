/* React */
import React from 'react';

import { fetchUser } from "../../actions/userActions";
import { fetchProjects } from "../../actions/projectsActions";
import { fetchRooms } from "../../actions/roomsActions";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

/* Component */
class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let component = (
      <div className="loading-wrap">
        <div className="loading">
          <img src="/images/appex.svg" alt="appex" className="loading__img"/>
        </div>
      </div>
    );

    let status = ['loading', 'loading', 'loading'];

    /* check user authentication */
    if (!this.props.user && !this.props.isFetching) {
      this.props.fetchUser();
      return component;
    }
    if (this.props.status !== 'ok' && this.props.status !== 'loading' || this.props.error) {
      component = <Redirect to={{ pathname: "/sign_in" }}/>;
      status[0] = 'err';
    }

    if (this.props.user && this.props.status === 'ok' && !this.props.isFetching && !this.props.error) {
      status[0] = 'ok';
    }

    /* projects */
    process.nextTick(() => {
      if (!this.props.projectsFulfilled && !this.props.projectsIsFetching) { this.props.fetchProjects() }
    });


    if (this.props.projectsError) {
      status[1] = 'err';
    } else if (this.props.projectsFulfilled) { status[1] = 'ok'; }

    /* rooms */
    process.nextTick(() => {
      if (!this.props.roomsFulfilled && !this.props.roomsIsFetching) { this.props.fetchRooms() }
    });

    if (this.props.roomsError) {
      status[2] = 'err';
    } else if (this.props.roomsFulfilled) { status[2] = 'ok'; }


    let ok = true;
    status.forEach(code => {
      if (code !== 'ok') { ok = false; }
    });

    if (ok) { component = this.props.children; }

    return component;
  }
}

function mapStateToProps(store) {
  return {

    /* user */
    user: store.userData.user,
    isFetching: store.userData.isFetching,
    status: store.userData.status,
    error: store.userData.error,

    /* projects */
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
    projectsError: store.projects.error,
    projectsFulfilled: store.projects.fulfilled,

    /* rooms */
    rooms: store.rooms.data,
    roomsIsFetching: store.rooms.isFetching,
    roomsError: store.rooms.error,
    roomsFulfilled: store.rooms.fulfilled,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser())
    },
    fetchProjects: () => {
      dispatch(fetchProjects())
    },
    fetchRooms: () => {
      dispatch(fetchRooms())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);