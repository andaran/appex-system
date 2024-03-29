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
  faPaperPlane,
  faSyncAlt,
  faExternalLinkAlt,
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
import {connectToDevRoom, socket, updateAppCode} from '../../../socketCore';
import { changeAppState } from "../../../actions/appStateActions";
import { fetchUser } from "../../../actions/userActions";
import { Link } from "react-router-dom";
import AlertsView from "../../../tools/alerts/alertsView";

/* Component */
class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    /* settings */
    this.host = window.location.href.split('projects')[0];

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

    /* if the screen is too small */
    const width = document.documentElement.offsetWidth;
    const height = document.documentElement.offsetHeight;
    if (width < 1080 || height < 910) {
      return (
        <Message type={false}
                 text="Ваш экран слишком маленький для отображения редактора кода"
                 underText="Попробуйте открыть на более большом мониторе или уменьмить масштаб"
                 center={true}/>
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
      this.timeout = setTimeout(() => {
        if (Date.now() - this.state.message.time > 3999) {
          this.setState({ message: false });
        }
      }, 4000);
    }

    /* render settings window */
    let modal;
    this.props.modal.status? modal = <Wrap for={ <Window { ...this.app } /> } />: modal = null;

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
            <iframe
              src={`${ this.host }view/${ this.id }?devMode=true`}
              frameBorder="0"
              id="iframe"/>
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
            <div className={`app-demo__nav-item`}
                 onClick={() => {
                   window.open(`../view/${ this.id }?devMode=true`,
                     "Emulator",
                     "width=375,height=812");
                 }}>
              <FontAwesomeIcon icon={ faExternalLinkAlt } className="app-demo__nav-item-icon"/>
            </div>
            <div className={`app-demo__nav-item`}
                 onClick={() => {
                   document.getElementById('iframe')
                     .contentWindow.location.reload(true)
                 }}>
              <FontAwesomeIcon icon={ faSyncAlt } className="app-demo__nav-item-icon"/>
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
    document.addEventListener('keydown', this.keydown);
    this.pressed = new Set();

    const settingsButton = document.getElementById('app-navbar__settings');
    if (settingsButton !== null) {
      setTimeout(() => settingsButton.onclick = this.settings, 100);
    }

    /* set app state */
    this.props.changeAppState({ state: 'closed', type: 'my', id: this.id });

    /* connect do devRoom to update interpreter */
    if (socket.listeners('updateAppCode').length > 0) { return; }

    /* connect to devRoom */
    connectToDevRoom(this.id);



    /*   ---==== Alerts ====---   */

    const alerts = new AlertsView(this.props.user.alerts, 'ProjectPage', this.props.fetchUser);
    alerts.run();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.moveEmulator);
    document.removeEventListener('keydown', this.keydown);
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
    document.querySelector('.app-demo__emulator')
      .classList.add('app-demo__emulator_moving');
    document.getElementById('app-demo').style.transition = '0s';
  }

  resizeMouseDown() {
    this.mouseDown = true;

    document.addEventListener('mousemove', this.resizeEmulator);
    document.body.style.userSelect = 'none';
    document.querySelector('.app-demo__emulator')
      .classList.add('app-demo__emulator_moving');
    document.getElementById('app-demo').style.transition = '0s';
  }

  mouseUp() {
    if (this.mouseDown) {
      this.mouseDown = false;
      document.removeEventListener('mousemove', this.moveEmulator);
      document.removeEventListener('mousemove', this.resizeEmulator);
      document.body.style.userSelect = 'auto';
      document.querySelector('.app-demo__emulator')
        .classList.remove('app-demo__emulator_moving');
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
        this.setState({message: { type: true, text: 'Код отправлен!', time: Date.now() }});
      } else {
        this.setState({message: { type: false, text: 'Ошибка отправки!', time: Date.now() }});
      }
    }).catch(err => {
      this.setState({message: { type: false, text: 'Ошибка отправки!', time: Date.now() }});
    }).finally(() => {
      localStorage.setItem('update-' + id, JSON.stringify(this.app));
      localStorage.setItem('user', JSON.stringify(this.props.user));
      setTimeout(() => localStorage.setItem('update-' + id, null), 3000);
      updateAppCode(this.id);
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
        const value = JSON.stringify( this.app.code );
        localStorage.setItem(this.app.id, value);
        setTimeout(() => {
          this.setState({message: { type: true, text: 'Бекап сохранен!', time: Date.now() }});
        });
      } catch {
        this.setState({message: { type: true, text: 'Ошибка создания бекапа :(', time: Date.now() }});
      }
      return false;
    }

    /* download from localStorage */
    if (event.ctrlKey && event.code === 'KeyD') {
      event.preventDefault();
      try {
        let code = localStorage.getItem( this.app.id );
        if (code === null) {
          return this.setState({message: { type: false, text: 'Бекапа не найденно!', time: Date.now() }});
        }
        this.download(code);
        this.setState({message: { type: true, text: 'Бекап загружен!', time: Date.now() }});
      } catch {
        this.setState({message: { type: true, text: 'Ошибка загрузки бекапа :(', time: Date.now() }});
      }
      return false;
    }

    /* release */
    setTimeout(() => {
      if (event.altKey && event.code === 'KeyR') {
        event.preventDefault();
        this.download('_', false);
        this.setState({message: { type: true, text: 'Релиз кода создан!', time: Date.now() }});
        return false;
      }
    });

    /* Switch mode */
    if (event.altKey && event.code === 'KeyV') {
      event.preventDefault();
      setTimeout(() => {
        const mode = this.state.mode;
        mode === 'any' ? this.setState({ mode: 'one' }) : this.setState({ mode: 'any' });
      });
      return false;
    }

    /* full view */
    if (event.altKey && event.code === 'KeyF') {
      event.preventDefault();
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
      return false;
    }

    /* settings */
    if (event.altKey && event.code === 'KeyS') {
      event.preventDefault();
      this.settings();
      return false;
    }

    /* save */
    if (event.ctrlKey && event.code === 'KeyS') {
      event.preventDefault();
      setTimeout(() => this.upload());
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

    if(!mode) {
      setTimeout(() => this.upload(), 4000);
    }
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

    /* app state */
    appState: store.appState.state,
    appId: store.appState.id,
    appType: store.appState.type,

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
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
    fetchUser: () => {
      dispatch(fetchUser())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);