import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchProjects } from '../../../actions/projectsActions';
import { connect } from "react-redux";

/* codemirror */
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/addon/hint/show-hint.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlembedded/htmlembedded';

import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/javascript-hint';

import Button from "../../../tools/button/Button";
import Error from '../error-404/Error404';
import Navbar from '../navbar/Navbar';
import CodeEditor from '../code-editor/CodeEditor';
import Interpreter from '../../../tools/interpreter/Interpreter';

/* Component */
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.match.params.id;

  }

  render() {

    /* find app */
    if (this.props.projects !== 0) {
      this.app = this.props.projects.find(elem => elem.id === this.id);
    } else {
      this.app = false;
    }

    if(!this.app) {
      return (
        <Error/>
      );
    }

    return (
      <div>
        <Navbar path = '../images/appex.svg' />
        <div className="editors-wrap">
          <CodeEditor
            id='code-editor-htmlembedded'
            type='htmlembedded'
            message='HTML'
            code={ this.app.code.html }
            appId={ this.id }/>
          <CodeEditor
            id='code-editor-javascript'
            type='javascript'
            message='JAVASCRIPT'
            code={ this.app.code.js }
            appId={ this.id }/>
          <CodeEditor
            id='code-editor-css'
            type='css'
            message='CSS'
            code={ this.app.code.css }
            appId={ this.id }/>
        </div>
        <div className="app-demo">
          <Interpreter
            app = { this.app }/>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.projects.length === 0 && !this.props.projectsIsFetching) {
      this.props.fetchProjects();
    }
  }
}

function mapStateToProps(store) {
  return {
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);