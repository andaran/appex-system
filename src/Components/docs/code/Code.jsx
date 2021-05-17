/* React */
import React from 'react';

/* Component */
export default class Code extends React.Component {

  render() {
    return (
      <pre className="doc__code">
        <code>
          { this.props.children }
        </code>
      </pre>
    );

  }

  componentDidMount() {

  }
}