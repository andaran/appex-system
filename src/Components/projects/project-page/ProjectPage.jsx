import React from 'react';

import {
  faPlus,
  faThumbtack,
  faArrowsAlt,
  faArrowsAltH,
  faExpandArrowsAlt,
  faCompressArrowsAlt,
  faLock,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { connect } from "react-redux";

/* codemirror */
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/addon/hint/show-hint.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror-minimap';

import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/javascript-hint';

import 'codemirror-minimap/src/minimap.css';

import Button from "../../../tools/button/Button";
import Error from '../error-404/Error404';
import Navbar from '../navbar/Navbar';
import AppNavbar from '../app-navbar/AppNavbar';
import CodeEditor from '../code-editor/CodeEditor';
import Interpreter from '../../../tools/interpreter/Interpreter';
import Message from '../../../tools/message/Message';
import Window from '../create-app-window/CreateAppWindow';
import Wrap from '../../../tools/modal-wrap/ModalWrap';
import App from '../../../socketCore';

/* Component */
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    let id = window.location.href.split('/');
    id[id.length - 1] !== '' ? this.id = id[id.length - 1] : this.id = id[id.length - 2];
    this.mouseDown = false;
    this.hotkey = true;
    this.downloadFlag = false;
    this.appJS = null;
    this.playJSFlag = false;

    this.state = {
      mode: 'any',
      page: 0,
      message: false,
      emulator: {
        positionMode: false,
        resizeMode: false,
        fullscreenMode: false,
        width: 445,
        marginLeft: 20,
      }
    }

    // bind

    /* hotkeys */
    this.keydown = this.keydown.bind(this);

    /* emulator */
    this.changeEmulatorPositionMode = this.changeEmulatorPositionMode.bind(this);
    this.changeEmulatorResizeMode = this.changeEmulatorResizeMode.bind(this);
    this.changeEmulatorFullscreenMode = this.changeEmulatorFullscreenMode.bind(this);
    this.moveMouseDown = this.moveMouseDown.bind(this);
    this.resizeMouseDown = this.resizeMouseDown.bind(this);
    this.resizeEmulator = this.resizeEmulator.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.moveEmulator = this.moveEmulator.bind(this);
    this.playJS = this.playJS.bind(this);
    this.settings = this.settings.bind(this);

    /* download */
    this.download = this.download.bind(this);

    /* upload */
    this.upload = this.upload.bind(this);
  }

  render() {

    /* if any err or projects isn`t loaded */
    if (this.props.projects === undefined ||
        this.props.projectsFulfilled === false ||
        this.props.projectsIsFetching ||
        this.props.projectsError) {
      return (
        <div className="loading-wrap">
          <div className="loading">
            <img src="/images/appex.svg" alt="appex" className="loading__img"/>
          </div>
        </div>
      );
    }

    /* find app */
    if (this.props.projects.length !== 0) {
      this.app = this.props.projects.find(elem => elem.id === this.id);
    } else {
      this.app = false;
    }

    /* if app isn`t being */
    if(!this.app) {
      return (
        <Error/>
      );
    }

    /* render message */
    let message = null;
    if (this.state.message) {
      message = <Message { ...this.state.message }/>;
      setTimeout(() => {
        this.setState({ message: false });
      }, 600);
    }

    /* render settings window */
    let modal;
    this.props.modal.status? modal = <Wrap for={ <Window { ...this.app } /> } />: modal = null;

    process.nextTick(() => {
      document.getElementById('app-demo__playJS').classList.remove('app-demo__nav-item_true');
      this.playJSFlag = false;
    });

    return (
      <div
        className="project-page-container"
        onMouseUp={ this.mouseUp }>
        { message }
        { modal }
        <AppNavbar app = { this.app }/>
        <div
          className={` app-demo
            app-demo-position-${ this.state.emulator.positionMode }
            app-demo-fullscreen-${ this.state.emulator.fullscreenMode } `}
          style = {{
            width: this.state.emulator.width + 'px',
            marginLeft: this.state.emulator.marginLeft + 'px',
          }}
          id = 'app-demo'>
          <div className="app-demo__emulator">
            <Interpreter
              app = { this.app }
              id="interpreter-mobile"/>
          </div>
          <div className="app-demo__nav">
            <div
              className={`app-demo__nav-item app-demo__nav-item_${ this.state.emulator.positionMode }`}
              onClick={ this.changeEmulatorPositionMode }>
              <FontAwesomeIcon icon={ faThumbtack } className="app-demo__nav-item-icon"/>
            </div>
            <div
              className="app-demo__nav-item"
              onMouseDown={ this.moveMouseDown }>
              <FontAwesomeIcon icon={ faArrowsAlt } className="app-demo__nav-item-icon"/>
            </div>
            <div className={`app-demo__nav-item app-demo__nav-item_${ this.state.emulator.resizeMode }`}
                 onClick={ this.changeEmulatorResizeMode }>
              <FontAwesomeIcon icon={ faLock } className="app-demo__nav-item-icon"/>
            </div>
            <div className="app-demo__nav-item"
                 onMouseDown={ this.resizeMouseDown }>
              <FontAwesomeIcon icon={ faArrowsAltH } className="app-demo__nav-item-icon"/>
            </div>
            <div className={`app-demo__nav-item app-demo__nav-item_${ this.state.emulator.fullscreenMode }`}
                 onClick={ this.changeEmulatorFullscreenMode }>
              <FontAwesomeIcon icon={ faExpandArrowsAlt } className="app-demo__nav-item-icon"/>
            </div>
            <div className='app-demo__nav-item'
                 id='app-demo__playJS'
                 onClick={ this.playJS }>
              <FontAwesomeIcon icon={ faPlay } className="app-demo__nav-item-icon"/>
            </div>
          </div>
        </div>
        <div
          className={`editors-wrap-${ this.state.mode } editors-wrap-${ this.state.mode }_${ this.state.page }`}
          id="editors-wrap">
          <CodeEditor
            id='code-editor-htmlembedded'
            type='htmlembedded'
            message='HTML'
            code={ this.app.code.html }
            appId={ this.id }
            key={ this.state.mode + '-1' }
            mode={ this.state.mode }/>
          <CodeEditor
            id='code-editor-css'
            type='css'
            message='CSS'
            code={ this.app.code.css }
            appId={ this.id }
            key={ this.state.mode + '-2' }
            mode={ this.state.mode }/>
          <CodeEditor
            id='code-editor-javascript'
            type='javascript'
            message='JAVASCRIPT'
            code={ this.app.code.js }
            appId={ this.id }
            key={ this.state.mode + '-3' }
            mode={ this.state.mode }/>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.projectsFulfilled && !this.props.projectsIsFetching) {
      this.props.fetchProjects();
    }

    if (this.props.projectsError) {
      console.log('Неизвестная ошибка загрузки проектов!');
      this.setState({message: { type: false, text: 'Неизвестная ошибка загрузки проектов!'}});
    }

    /* hotkeys */
    document.onkeydown = this.keydown;
    this.pressed = new Set();

    const settingsButton = document.getElementById('app-navbar__settings');
    if (settingsButton !== null) {
      setTimeout(() => settingsButton.onclick = this.settings, 100);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.moveEmulator);
    this.appJS = null;
  }



  /*   ---==== Emulator actions ====---   */

  changeEmulatorPositionMode() {
    const oldState = this.state.emulator;
    if (oldState.fullscreenMode) { return; }
    this.setState({ emulator: {...oldState, positionMode: !this.state.emulator.positionMode} });
  }

  changeEmulatorResizeMode() {
    const oldState = this.state.emulator;
    if (oldState.fullscreenMode) { return; }
    if (oldState.resizeMode === true) {
      this.setState({ emulator: {...oldState, resizeMode: false, width: 445} });
    } else {
      this.setState({ emulator: {...oldState, resizeMode: true} });
    }
  }

  changeEmulatorFullscreenMode() {
    const oldState = this.state.emulator;
    this.setState({ emulator: {...oldState, fullscreenMode: !this.state.emulator.fullscreenMode} });
  }

  moveMouseDown() {
    this.mouseDown = true;

    document.addEventListener('mousemove', this.moveEmulator);
    document.body.style.userSelect = 'none';
    document.getElementById('app-demo').style.transition = '0s';
  }

  resizeMouseDown() {
    this.mouseDown = true;

    document.addEventListener('mousemove', this.resizeEmulator);
    document.body.style.userSelect = 'none';
    document.getElementById('app-demo').style.transition = '0s';
  }

  mouseUp() {
    if (this.mouseDown) {
      this.mouseDown = false;
      document.removeEventListener('mousemove', this.moveEmulator);
      document.removeEventListener('mousemove', this.resizeEmulator);
      document.body.style.userSelect = 'auto';
      document.getElementById('app-demo').style.transition = '0.2s';
    }
  }

  moveEmulator(event) {
    const oldState = this.state.emulator;
    if (this.mouseDown && !oldState.fullscreenMode) {
      const left = event.pageX - oldState.width + 20;
      this.setState({ emulator: { ...oldState,
        marginLeft: left,
        positionMode: true
      }});
    } else {
      document.removeEventListener('mousemove', this.moveEmulator);
    }
  }

  resizeEmulator(event) {
    const oldState = this.state.emulator;
    if (this.mouseDown && !oldState.fullscreenMode) {
      const newWidth = event.pageX - oldState.marginLeft + 20;
      this.setState({ emulator: { ...oldState,
        positionMode: true,
        resizeMode: true,
        width: newWidth
      }});
    } else {
      document.removeEventListener('mousemove', this.resizeEmulator);
    }
  }

  playJS() {
    this.playJSFlag = !this.playJSFlag;
    if (this.playJSFlag) {

      /* find room settings */
      const id = this.app.id;
      const settings = this.props.user.settings.find(elem => elem.id === id);

      /* set socketCore class */
      const appObj = new App( this.app, settings );

      try {
        this.appJS = Function( 'App', this.app.code.js );
        this.appJS(appObj);
      } catch(e) {
        console.error('Ошибка запуска приложения!! \n\n', e);
      }

      document.getElementById('app-demo__playJS').classList.add('app-demo__nav-item_true');
    } else {
      this.forceUpdate();
    }
  }

  settings() {
    this.props.switchModalState(this.props.modal.status, 'set');
  }

  upload() {
    const code = this.app.code;
    const releaseCode = this.app.releaseCode;
    const id = this.app.id;

    /* send code to server */
    const body = JSON.stringify({ code, releaseCode, id });
    fetch('../api/change_app/code', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    }).then(res => res.json()).then(body => {
      if (body.status === 'ok') {
        this.setState({message: { type: true, text: 'Код отправлен!'}});
      } else {
        this.setState({message: { type: false, text: 'Ошибка отправки!'}});
      }
    }).catch(err => {
      this.setState({message: { type: false, text: 'Ошибка отправки!'}});
    });
  }



  /*   ---==== Hotkey events ====---   */

  keydown(event) {
    this.pressed.add(event.code);

    /* alt + ... */
    if (event.altKey && this.state.mode === 'one' && this.hotkey) {
      switch (event.code) {
        case 'ArrowRight': {
          event.preventDefault();
          let page = this.state.page;
          page < 3 ? this.setState({ page: ++page }) : this.setState({ page: 0 });
          if (page === 3) {
            this.hotkey = false;
            setTimeout(() => {
              this.setState({ page: 2 });
              this.hotkey = true;
            }, 200);
          }
          return false;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          let page = this.state.page;
          page > -1 ? this.setState({ page: --page }) : this.setState({ page: 2 });
          if (page === -1) {
            this.hotkey = false;
            setTimeout(() => {
              this.setState({ page: 0 });
              this.hotkey = true;
            }, 200);
          }
          return false;
        }
        default: {}
      }
    }

    /* save to localStorage */
    if (event.ctrlKey && event.code === 'KeyB') {
      event.preventDefault();
      try {
        process.nextTick(() => {
          const value = JSON.stringify( this.app.code );
          localStorage.setItem(this.app.id, value);
          this.setState({message: { type: true, text: 'Бекап сохранен!'}});
        });
      } catch {
        this.setState({message: { type: true, text: 'Ошибка создания бекапа :('}});
      }
      return false;
    }

    /* download from localStorage */
    if (event.ctrlKey && event.code === 'KeyD') {
      event.preventDefault();
      try {
        let code = localStorage.getItem( this.app.id );
        if (code === null) {
          return this.setState({message: { type: false, text: 'Бекапа не найденно!'}});
        }
        this.download(code);
        this.setState({message: { type: true, text: 'Бекап загружен!'}});
      } catch {
        this.setState({message: { type: true, text: 'Ошибка загрузки бекапа :('}});
      }
      return false;
    }

    /* release */
    process.nextTick(() => {
      if (event.altKey && event.code === 'KeyR') {
        event.preventDefault();
        this.download('_', false);
        this.setState({message: { type: true, text: 'Релиз кода создан!'}});
        return false;
      }
    });

    /* Switch mode */
    process.nextTick(() => {
      if (event.altKey && event.code === 'KeyV') {
        const mode = this.state.mode;
        mode === 'any' ? this.setState({ mode: 'one' }) : this.setState({ mode: 'any' });
        return false;
      }
    });

    /* upload */
    process.nextTick(() => {
      if (event.altKey && event.code === 'KeyU') {
        event.preventDefault();
        this.upload();
        return false;
      }
    });

    /* full view */
    if (event.altKey && event.code === 'KeyF') {
      event.preventDefault();
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
      return false;
    }

    /* play JS */
    if (event.altKey && event.code === 'KeyP') {
      event.preventDefault();
      this.playJS();
      return false;
    }

    /* settings */
    if (event.altKey && event.code === 'KeyS') {
      event.preventDefault();
      this.settings();
      return false;
    }
  }



  /*   ---==== Download app code ====---   */

  download(code, mode = true) {
    if (this.props.projectsIsFetching && this.props.projects.length !== 0) { return; }

    let appNumber;
    this.props.projects.map((project, index) => {
      if (this.app.id === project.id) {
        appNumber = index;
        return;
      }
    });

    let changedProjects = this.props.projects;
    mode
      ? changedProjects[appNumber].code = JSON.parse(code)
      : changedProjects[appNumber].releaseCode = changedProjects[appNumber].code;

    this.props.changeProjects( changedProjects.slice() );
  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* projects */
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
    projectsError: store.projects.error,
    projectsFulfilled: store.projects.fulfilled,

    /* user */
    user: store.userData.user,

    /* modal */
    modal: store.projectsModal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    },
    changeProjects: ( changedProjects ) => {
      dispatch(changeProjects( changedProjects ))
    },
    switchModalState: (state, mode) => {
      dispatch(switchModalState(state, mode))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);