/* React */
import React from 'react';

import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Component */
export default class Message extends React.Component {
  render() {

    /* change BG color */
    let color = '#e74c3c';
    if ( this.props.type ) { color = '#2ecc71'; }

    /* change icon */
    let icon = <FontAwesomeIcon icon={ faTimes }/>;
    if ( this.props.type ) { icon = <FontAwesomeIcon icon={ faCheck }/>; }

    return (
      <div className="message">
        <div className="message-background"/>
        <div className="message-box" style={{ backgroundColor: color }}>
          <div className="message-box__text"> { this.props.text } </div>
          <div className="message-box__icon"> { icon } </div>
        </div>
      </div>
    );
  }
}