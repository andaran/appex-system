import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { changeAppState } from "../../../actions/appStateActions";
import { connect } from "react-redux";

import SystemNavbar from '../system-navbar/SystemNavbar';
import AppIcon from '../app-icon/AppIcon';
import Interpreter from '../../../tools/interpreter/Interpreter';
import SuperButton from '../super-button/SuperButton';
import { Link } from "react-router-dom";

import SettingsApp from '../system-apps/settings/SettingsApp';

/* Component */
class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      touchStart: undefined,
      touchMove: undefined,
      lastMove: 0,
      moveTo: 'center',
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
      return <AppIcon { ...app } key={ app.id } type="my"/>;
    });

    /* installed apps */
    let installedApps = this.props.user.installedApps.map(app => {
      return <AppIcon { ...app } key={ app.id } type="downloaded"/>;
    });

    /* system apps */
    let systemApps = [
      <AppIcon color="#95a5a6" icon="faCog" title="Настройки" key="settings-icon" type="settings"/>,
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

    /* app */
    let appReadyFlag = false;
    if (this.props.appState === 'clicked') {
      if (this.props.appType === 'my') { appReadyFlag = true; }
      else if (this.props.apps.find(app => app.id === this.props.appId)) {
        appReadyFlag = true;
      }
    }

    /* open app if it's ready */
    appReadyFlag && process.nextTick(() => this.props.changeAppState({ state: 'opened' }));

    /* set Interpreter */
    let interpreter = null;
    let appObj;
    if (this.props.appState === 'opened' && ['my', 'downloaded'].includes(this.props.appType)) {
      // TODO: delete this fucking code
/*      this.props.appType === 'my'
        ? appObj = this.props.projects.find(foundApp => foundApp.id === this.props.appId)
        : appObj = this.props.apps.find(foundApp => foundApp.id === this.props.appId);*/

      interpreter = (
        <div>interpreter!</div>
      );
    } else if (this.props.appState === 'opened') {

      /* switch system app */
      switch (this.props.appType) {
        case 'settings':
          interpreter = <SettingsApp/>;
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
            <div className="app-settings" id="app-settings"></div>
            <div className="app-body" id="app-body" data-state={ this.props.appState }>
              { interpreter }
            </div>
            <SuperButton/>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

    /*setInterval(() => {
      document.getElementById('theme-color').setAttribute('content', '#000000');
      setTimeout(() => {
        document.getElementById('theme-color').setAttribute('content', '#ffffff');
      }, 1000);
    }, 2000);*/

    /*setTimeout(() => {
      document.getElementById('main-app-page').setAttribute('data-state', 'clicked');
    }, 1500);

    setTimeout(() => {
      document.getElementById('app-body').setAttribute('data-state', 'opened');
    }, 1800);*/

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

    // // alert('SET COLOR!');
    // document.getElementById('theme-color').setAttribute('content', '#ffffff');

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
        this.props.changeAppState({ state: 'closed' });
        break;
    }
  }

  resize(event) {
    const wrap = document.getElementById('groups-wrap');
    const background = document.getElementById('system-background');

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