import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { changeAppState } from "../../../actions/appStateActions";
import { connect } from "react-redux";
import { request } from "../../../tools/apiRequest/apiRequest";

import SystemNavbar from '../system-navbar/SystemNavbar';
import AppIcon from '../app-icon/AppIcon';
import Interpreter from '../../../tools/interpreter/Interpreter';
import SuperButton from '../super-button/SuperButton';
import { Link } from "react-router-dom";

import SettingsApp from '../system-apps/settings/SettingsApp';
import StoreApp from '../system-apps/store/StoreApp';

/* Component */
class MainPage extends React.Component {
  constructor(props) {
    super(props);

    /* settings */
    this.host = window.location.href.split('main')[0];

    this.state = {
      currentPage: 0,
      touchStart: undefined,
      touchMove: undefined,
      lastMove: 0,
      moveTo: 'center',
      interpreters: null,
    }

    // bind
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.movePage = this.movePage.bind(this);
    this.keydown = this.keydown.bind(this);
    this.resize = this.resize.bind(this);
  }

  render() {

    /* my apps */
    let myApps = this.props.projects.map(app => {
      return <AppIcon { ...app } key={ app.id } type="app"/>;
    });

    /* installed apps */
    let installedApps = this.props.user.installedApps.map(app => {
      return <AppIcon { ...app } key={ app.id } type="app"/>;
    });

    /* system apps */
    let systemApps = [
      <AppIcon color="#95a5a6"
               icon="faCog"
               title="Настройки"
               key="settings-icon"
               type="settings"
               id="settings-system-app"/>,
      <AppIcon color="#3498db"
               icon="faShoppingBag"
               title="Магазин"
               key="store-icon"
               type="store"
               id="store-system-app"/>,
    ]

    if(myApps.length) {
      myApps = <div className="apps-wrap">
      { myApps }
      </div>;
    }

    if(installedApps.length) {
      installedApps = <div className="apps-wrap">
      { installedApps }
      </div>;
    }

    /* page number */
    let points = [];
    for (let i = 0; i < 3; i++) {
      i === this.state.currentPage
        ? points.push(<div className="active point" key={ i }/>)
        : points.push(<div className="point" key={ i }/>);
    }

    /* closing animation */
    if (this.props.appState === 'closing') {
      this.closeTimeout = setTimeout(() => {
        this.props.changeAppState({ state: 'closed' });
      }, 210);
    }

    /* devMode */
    localStorage.getItem('devMode') === 'true'
      ? this.devMode = true
      : this.devMode = false;

    /* multiTasking */
    this.multiTasking = true;

    /* close all apps */
    if (this.props.appState === 'closed') {
      const nodeList = document.querySelectorAll('.multiTasking-interpreter');
      const interpreters = Array.from(nodeList);

      interpreters.forEach(node => {
        node.style.display = 'none';
      });
    }

    /* set multiTasking Interpreter */
    if (['opened', 'closing'].includes(this.props.appState) &&
        this.props.appType === 'app' &&
        this.multiTasking) {

      document.getElementById(this.props.appId).style.display = 'block';
    }

    /* set oneTasking Interpreter */
    let interpreter = null;
    if (['opened', 'closing'].includes(this.props.appState) &&
        this.props.appType === 'app' &&
        !this.multiTasking) {

      interpreter = (
        <iframe
          src={`${ this.host }view/${ this.props.appId }?devMode=${ this.devMode }`}
          frameBorder="0"
          id="app-iframe"
          style={{ width: '100%', height: '100%', backgroundColor: 'white' }}/>
      );

    /* set system app Interpreter */
    } else if (['opened', 'closing'].includes(this.props.appState)) {

      /* switch system app */
      switch (this.props.appType) {
        case 'settings':
          interpreter = <SettingsApp/>;
          break;
        case 'store':
          interpreter = <StoreApp/>;
          break;
        default:
          console.error('Ошибка открытия приложения!');
          break;
      }
    }

    return (
      <div className="system-wrap" id="system-wrap">
        <div className="system-pc" id="system-pc">
          <div className="system-pc_box">
            <div className="box-title">
              <img src="./images/appex.svg" alt="a" className="box-title__img" />
              <span className="box-title__text"> ppex </span>
              <div className="box-title__under-text"> system </div>
            </div>
            <div className="box-main">
              <span> Листать </span>
              <span> ⯇ </span>
              <span> ⯈ </span>
            </div>
            <div className="box-main">
              <span> Свернуть </span>
              <span> ▼ </span>
            </div>
          </div>
        </div>
        <div className="main-system-page" id="main-system-page">
          <div className="system-background-wrap">
            <img src="./images/bg-horizontal.jpg" id="system-background" className="system-background"/>
          </div>
          <div className="groups-wrap" id="groups-wrap">
            <div className="app-group">
              <div className="app-group-widget">
                <div className="app-group-widget__title">Мои приложения:</div>
                <div className="app-group-widget__main">
                  Здесь находятся приложения, которые вы создали. Хотите начать новый проект? Тогда вам
                  <Link to="/projects"> сюда</Link>.
                </div>
              </div>
              <div className="app-group__icons"> { myApps } </div>
            </div>
            <div className="app-group">
              <div className="app-group-widget">
                <div className="app-group-widget__title">Сторонние приложения:</div>
                <div className="app-group-widget__main">
                  А здесь обитают приложения, которые вы скачали. Нужно загрузить ещё парочку? Тогда вам
                  <Link to="/projects"> сюда</Link>.
                </div>
              </div>
              <div className="app-group__icons"> { installedApps } </div>
            </div>
            <div className="app-group">
              <div className="app-group-widget">
                <div className="app-group-widget__title">Системные приложения:</div>
                <div className="app-group-widget__main">
                  Тут располагаются системные приложения. Они нужны для настройки системы и для будущих функций.
                </div>
              </div>
              <div className="app-group__icons"> { systemApps } </div>
            </div>
          </div>
          <div className="page-number">
            { points }
          </div>
          <div className="main-app-page" id="main-app-page" data-state={ this.props.appState }>
            { interpreter } {/* oneTasking */}
            { this.state.interpreters } {/* multiTasking */}
            <SuperButton multiTasking={ this.multiTasking }/>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

    /* find OS */
    const userDeviceArray = [
      {device: false, platform: /Android/},
      {device: false, platform: /iPhone/},
      {device: false, platform: /iPad/},
      {device: false, platform: /Symbian/},
      {device: false, platform: /Windows Phone/},
      {device: false, platform: /Tablet OS/},
      {device: true, platform: /Linux/},
      {device: true, platform: /Windows NT/},
      {device: true, platform: /Macintosh/}
    ];

    const platform = navigator.userAgent;
    let device;

    for (let i in userDeviceArray) {
      if (userDeviceArray[i].platform.test(platform)) {
        device = userDeviceArray[i].device;
        break;
      }
    }

    /* scroll the menu */
    const wrap = document.getElementById('groups-wrap');
    const systemWindow = document.getElementById('main-system-page');
    const systemBackground = document.getElementById('system-pc');

    wrap.addEventListener('touchstart', this.touchStart);
    wrap.addEventListener('touchend', this.touchEnd);
    wrap.addEventListener('touchmove', this.touchMove);

    if (systemWindow.offsetWidth / systemWindow.offsetHeight > 1.6 && device) {
      systemWindow.style.width = systemWindow.offsetHeight + 'px';
      systemWindow.classList.add('main-system-page__pc-mode');

      const width = document.getElementById('system-wrap').offsetWidth - systemWindow.offsetWidth;
      systemBackground.classList.add('system-pc__active');
      systemBackground.style.width = width + 'px';
    }

    window.addEventListener('resize', this.resize, device);
    window.addEventListener('keydown', this.keydown);



    /*   ---==== Caching all apps ====---   */

    /* user */
    localStorage.setItem('user', JSON.stringify(this.props.user));

    /* my apps */
    this.props.projects.forEach(app => {
      request('/api/get_app', { appId: app.id })
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            console.log("cached project ", app.id);
            localStorage.setItem('cache-' + app.id, JSON.stringify(body.app));
          } else {
            console.log('err in caching project ' + app.id);
          }
      }).catch(err => console.log('err in caching project ' + app.id));
    });

    /* installed apps */
    this.props.user.installedApps.forEach(app => {
      request('/api/get_app', { appId: app.id })
        .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          console.log("cached app ", app.id);
          localStorage.setItem('cache-' + app.id, JSON.stringify(body.app));
        } else {
          console.log('err in caching app ' + app.id);
        }
      }).catch(err => console.log('err in caching app ' + app.id));
    });



    /*   ---==== MultiTasking ====---   */

    /* if multiTasking if off */
    if (!this.multiTasking) { return; }

    const interpreters = [];

    /* my apps */
    this.props.projects.forEach((app, index) => {
      const interpreter = <iframe
        src={`${ this.host }view/${ app.id }?devMode=${ this.devMode }`}
        frameBorder="0"
        id={ app.id }
        className="multiTasking-interpreter"
        style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'none'}}
        key={ 'project-' + index }/>;
      interpreters.push(interpreter);
    });

    /* installed apps */
    this.props.user.installedApps.forEach((app, index) => {
      const interpreter = <iframe
        src={`${ this.host }view/${ app.id }?devMode=${ this.devMode }`}
        frameBorder="0"
        id={ app.id }
        className="multiTasking-interpreter"
        style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'none' }}
        key={ 'app-' + index }/>;
      interpreters.push(interpreter);
    });

    /* render all interpreters */
    this.setState({ interpreters });

  }

  touchStart(event) {

    /* set finger cords */
    this.setState({ touchStart: event.touches[event.touches.length - 1].pageX });
  }

  touchEnd(event) {

    /* constants */
    const wrap = document.getElementById('groups-wrap');
    const width = wrap.offsetWidth;
    const deltaTime = Date.now() - this.state.lastMove;
    let deltaPage = 0;
    let move = this.state.touchMove - this.state.touchStart;

    /* natural flipping */
    if (move > (width / 2) && this.state.currentPage > 0) {
      deltaPage = -1;
    } else if ((move * -1) > (width / 2) && this.state.currentPage < 2) {
      deltaPage = 1;
    }

    /* swipe flipping */
    if (this.state.moveTo === 'right' && deltaTime < 50 && this.state.currentPage < 2) {
      deltaPage = 1;
    } else if (this.state.moveTo === 'left' && deltaTime < 50 && this.state.currentPage > 0) {
      deltaPage = -1;
    }

    /* move page, background and save params */
    this.movePage(deltaPage);

  }

  touchMove(event) {

    /* constants */
    const cord = event.touches[event.touches.length - 1].pageX;
    const wrap = document.getElementById('groups-wrap');
    const width = wrap.offsetWidth;

    /* move page under finger */
    let moveTo;
    let left = cord - this.state.touchStart;

    if (left > 0 && this.state.currentPage < 1) { left /= 4 }
    else if (left < 0 && this.state.currentPage > 1) { left /= 4 }

    left += -1 * this.state.currentPage * width;

    wrap.style.left = left + 'px';
    wrap.style.transition = '0s';

    /* calc swipe direction */
    if (cord > this.state.touchMove) {
      moveTo = 'left';
    } else if (cord < this.state.touchMove) {
      moveTo = 'right';
    } else {
      moveTo = 'center';
    }

    /* save params */
    this.setState({ touchMove: cord, lastMove: Date.now(), moveTo });
  }

  movePage(deltaPage) {

    const wrap = document.getElementById('groups-wrap');
    const background = document.getElementById('system-background');
    const width = wrap.offsetWidth;
    const currentPage = this.state.currentPage + deltaPage;

    if (currentPage > 2 || currentPage < 0) { return; }

    this.setState({ touchStart: 0, currentPage });
    wrap.style.transition = '.2s ease-out';
    wrap.style.left = (-1 * currentPage * width) + 'px';
    background.style.marginLeft = (-20 * currentPage) + 'px';

  }

  keydown(event) {
    switch (event.key) {
      case 'ArrowRight':
        if (this.props.appState !== 'closed') { return; }
        this.movePage(1);
        break;
      case 'ArrowLeft':
        if (this.props.appState !== 'closed') { return; }
        this.movePage(-1);
        break;
      case 'ArrowDown':
        this.props.changeAppState({ state: 'closing' });
        break;
    }
  }

  resize(event) {
    const wrap = document.getElementById('groups-wrap');
    const background = document.getElementById('system-background');

    if (!wrap || !background) { return; }
    if (wrap.offsetWidth > background.offsetWidth && !this.device) {
      background.style.visibility = 'hidden';
    } else {
      background.style.visibility = 'visible';
    }
  }

  componentWillUnmount() {

    /* remove event listeners */
    const wrap = document.getElementById('groups-wrap');

    wrap.removeEventListener('touchstart', this.touchStart);
    wrap.removeEventListener('touchend', this.touchEnd);
    wrap.removeEventListener('touchmove', this.touchMove);

    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('resize', this.resize);
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

    /* downloaded apps */
    apps: store.apps.data,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);