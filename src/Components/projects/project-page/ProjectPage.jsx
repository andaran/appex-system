import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../tools/button/Button";
import { fetchProjects } from '../../../actions/projectsActions';
import { connect } from "react-redux";

/* Component */
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    console.log(this.props.match.params.id);

    return (
      <div> Hello from ProjectPage!!! </div>
    );
  }

  componentDidMount() {
    if (this.props.projects.length === 0 && !this.props.projectsIsFetching) {
      this.props.fetchProjects();
    }
  }
}

function mapStateToProps(store) {
  return {
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);