/* React */
import React from 'react';

/* Components */
import Navbar from '../navbar/Navbar';

/* Component */
export default class ProjectsWrap extends React.Component {
  render() {
    return (
      <div className="projects-wrap">
        <Navbar />
        <div className="cards-wrap"></div>
      </div>
    );
  }
}