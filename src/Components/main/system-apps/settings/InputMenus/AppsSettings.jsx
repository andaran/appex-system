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
      return <AppBlock { ...project }
                       type="project"
                       user={{ ...this.props.user }}
                       key={ project.id }
                       fetchUser={ this.props.fetchUser }/>;
    });

    /* installed apps */
    let apps = this.props.user.installedApps.map(app => {
      return <AppBlock { ...app }
                       type="app"
                       user={{ ...this.props.user }}
                       key={ app.id }
                       fetchUser={ this.props.fetchUser }/>;
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