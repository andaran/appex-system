import React from 'react';

import AppBlock from './AppBlock';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    /* my apps */
    let projects = this.props.projects.map(project => {
      return <AppBlock { ...project } user={{ ...this.props.user }} key={ project.id }/>;
    });

    /* installed apps */
    let apps = this.props.user.installedApps.map(app => {
      return <AppBlock { ...app } user={{ ...this.props.user }} key={ app.id }/>;
    });

    return (
      <div className="apps-settings-wrap">
        <div className="reg-window">
          { projects }
          { apps }
        </div>
      </div>
    );
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }
}