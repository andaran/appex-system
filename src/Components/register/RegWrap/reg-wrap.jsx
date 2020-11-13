/* React */
import React from 'react';

/* Styles */
import './reg-wrap.sass';

/* Components */
import Window from '../RegWindow/reg-window';

/* Component */
export default class RegWrap extends React.Component {
  render() {
    return (
      <div className="reg-wrap">
        <Window />
      </div>
    );
  }
}