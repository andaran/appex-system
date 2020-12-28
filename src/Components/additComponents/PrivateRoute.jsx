/* React */
import React from 'react';
import { fetchUser } from "../../actions/userActions";
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

    /* check authentication */
    if (!this.props.user && !this.props.isFetching) { this.props.fetchUser(); }
    if (this.props.status !== 'ok' && this.props.status !== 'loading' || this.props.error) {
      component = <Redirect to={{ pathname: "/sign_in" }}/>;
    }
    if (this.props.user && this.props.status === 'ok' && !this.props.isFetching && !this.props.error) {
      component = this.props.children;
    }

    return component;
  }
}

function mapStateToProps(store) {
  return {
    user: store.userData.user,
    isFetching: store.userData.isFetching,
    status: store.userData.status,
    error: store.userData.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);