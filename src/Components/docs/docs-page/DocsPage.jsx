/* React */
import React from 'react';

import TitleWrap from '../title-wrap/TitleWrap';
import MainDoc from "../main-doc/MainDoc";
import Navbar from "../../projects/navbar/Navbar";

/* Component */
export default class DocsPage extends React.Component {

  render() {

    if (this.props.mode === 'app') {
      return <div className="doc-page-wrap doc-page-wrap_app-mode">
        <div className="doc-page doc-page_app-mode">
          <MainDoc/>
        </div>
      </div>
    } else {
      return <div className="doc-page-wrap">
          <Navbar path="./images/appex.svg" />
          <div className="doc-page">
            <TitleWrap/>
            <MainDoc/>
          </div>
        </div>
    }
  }

  componentDidMount() {

  }
}