import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";


/* Component */
export default class Widget extends React.Component {

  render() {

    let value = this.props.value;
    switch (this.props.value) {
      case true:
        value = 'ON';
        break;
      case false:
        value = 'OFF';
        break;
    }

    let title = null;
    if (this.props.title !== '') {
      title = <section> { this.props.title } </section>;
    }

    return (
      <div className="widget-wrap">
        <section>
          <FontAwesomeIcon icon={ Icons[this.props.icon || 'faThermometerHalf'] } />
        </section>
        <section> { value } </section>
        { title }
      </div>
    );
  }
}