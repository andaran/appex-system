/* React */
import React from 'react';

/* Component */
export default class ProjectsWrap extends React.Component {
  render() {
    return (
      <div className="modal-wrap">
          { this.props.for }
      </div>
    );
  }
}