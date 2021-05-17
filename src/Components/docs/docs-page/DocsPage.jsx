/* React */
import React from 'react';

import TitleWrap from '../title-wrap/TitleWrap';
import MainDoc from "../main-doc/MainDoc";

/* Component */
export default class DocsPage extends React.Component {

  render() {
    return <div className="doc-page">
      <TitleWrap/>
      <MainDoc/>
    </div>
  }

  componentDidMount() {

  }
}