/* React */
import React from 'react';

/* Component */
export default class DocItem extends React.Component {

  render() {
    return <div className="doc__item" id={ this.props.id }>
      <h2> { this.props.title } </h2>
      { this.props.children }
    </div>
  }

  componentDidMount() {

  }
}