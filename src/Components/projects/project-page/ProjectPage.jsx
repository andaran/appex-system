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
import AppNavbar from '../app-navbar/AppNavbar';
import CodeEditor from '../code-editor/CodeEditor';
import Interpreter from '../../../tools/interpreter/Interpreter';

/* Component */
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.props.match.params.id;

    this.state = {
      mode: 'any',
      page: 0,
    }

    // bind
    this.keydown = this.keydown.bind(this);
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
      <div className="project-page-container">
        <Navbar path = '../images/appex.svg' />
        <AppNavbar app = { this.app }/>
        <div className="app-demo">
          <Interpreter
            app = { this.app }
            id="interpreter-mobile"/>
        </div>
        <div className="app-demo app-demo-desktop" id="interpreter-desktop-wrap">
          <Interpreter
            app = { this.app }
            id="interpreter-desktop"/>
        </div>
        <div className={`editors-wrap-${ this.state.mode } editors-wrap-${ this.state.mode }_${ this.state.page }`}>
          <CodeEditor
            id='code-editor-htmlembedded'
            type='htmlembedded'
            message='HTML'
            code={ this.app.code.html }
            appId={ this.id }/>
          <CodeEditor
            id='code-editor-css'
            type='css'
            message='CSS'
            code={ this.app.code.css }
            appId={ this.id }/>
          <CodeEditor
            id='code-editor-javascript'
            type='javascript'
            message='JAVASCRIPT'
            code={ this.app.code.js }
            appId={ this.id }/>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.projects.length === 0 && !this.props.projectsIsFetching) {
      this.props.fetchProjects();
    }

    /* Set emulator size */
    process.nextTick(() => {
      let desktopEmu = document.getElementById('interpreter-desktop-wrap');
      console.log('EMU', desktopEmu.offsetWidth);
      const height = desktopEmu.offsetWidth * 0.56;
    });

    /* hotkeys */
    document.addEventListener('keydown', this.keydown);
    this.pressed = new Set();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown);
  }

  keydown(event) {
    this.pressed.add(event.code);

    /* alt + ... */
    if (event.altKey && this.state.mode === 'one') {
      switch (event.code) {
        case 'ArrowRight': {
          event.preventDefault();
          let page = this.state.page;
          page < 3 ? this.setState({ page: ++page }) : this.setState({ page: 0 });
          if (page === 3) {
            setTimeout(() => this.setState({ page: 2 }), 200);
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          let page = this.state.page;
          page > -1 ? this.setState({ page: --page }) : this.setState({ page: 2 });
          if (page === -1) {
            setTimeout(() => this.setState({ page: 0 }), 200);
          }
          break;
        }
        default: {}
      }
    }

    /* Switch mode */
    if (event.altKey && event.key === 'v') {
      const mode = this.state.mode;
      mode === 'any' ? this.setState({ mode: 'one' }) : this.setState({ mode: 'any' });
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