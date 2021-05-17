/* React */
import React from 'react';

import TitleWrap from '../title-wrap/TitleWrap';
import MainDoc from "../main-doc/MainDoc";
import Navbar from "../../projects/navbar/Navbar";

/* Component */
export default class DocsPage extends React.Component {

  render() {
    return <div className="doc-page-wrap">
      <Navbar path="./images/appex.svg" />
      <div className="doc-page">
        <TitleWrap/>
        <MainDoc/>
      </div>
    </div>
  }

  componentDidMount() {

  }
}