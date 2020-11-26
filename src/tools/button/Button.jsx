/* React */
import React from 'react';

/* Component */
export default class Button extends React.Component {
  render() {

    /* DOCUMENTATION:
    {
      background: 'anyBackgroundColor',
      size: 'md',  // sm - 30px, md - 50px, lg - 70px
    }
    */

    return (
      <div
        className={`preset-button preset-button_${ this.props.size }`}
        id={ this.props.id }
        style = {{ backgroundColor: this.props.background }}>
        { this.props.children }
      </div>
    );
  }
}