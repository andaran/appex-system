/* React */
import React from 'react';

/* Components */
import Window from '../LogWindow/log-window';

/* Component */
export default class LogWrap extends React.Component {
  render() {
    return (
      <div className="reg-wrap">
        <Window />
      </div>
    );
  }
}