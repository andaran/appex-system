import React from 'react';
import AppBlock from './AppBlock';

/* Component */
export default class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    /* apps */
    let apps = this.props.projects.map(app => {
      return <AppBlock { ...app }
                       user={{ ...this.props.user }}
                       key={ app.id }
                       fetchUser={ this.props.fetchUser }/>;
    });

    return (
      <div className="apps-settings-wrap">
        <div className="reg-window">
          { apps }
        </div>
      </div>
    );
  }
}