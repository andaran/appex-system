import React from 'react';

import Doc from '../../../docs/docs-page/DocsPage';

/* Component */
export default class DocApp extends React.Component {

  render() {
    return <div style={{
      backgroundColor: 'black',
      height: '100vh',
      overflowY: 'scroll',
    }}>
      <Doc mode="app"/>
    </div>;
  }
}
