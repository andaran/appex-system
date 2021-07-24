import React from 'react';

import { changeAppState } from "../../../actions/appStateActions";
import { fetchUser } from "../../../actions/userActions";
import { connect } from "react-redux";
import { request } from "../../../tools/apiRequest/apiRequest";
import { Link } from "react-router-dom";
import AlertsView from "../../../tools/alerts/alertsView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faExpand, faPlus } from "@fortawesome/free-solid-svg-icons";
import io from 'socket.io-client';

import AppIcon from '../app-icon/AppIcon';
import SuperButton from '../super-button/SuperButton';
import SettingsApp from '../system-apps/settings/SettingsApp';
import StoreApp from '../system-apps/store/StoreApp';
import DocApp from '../system-apps/doc/DocApp';
import Widget from "../widget/Widget";

const socket = io();

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
      fullScreen: false,
      widgets: false,
    }


    // bind
    this.keydown = this.keydown.bind(this);
    this.resize = this.resize.bind(this);
    this.updateWidgets = this.updateWidgets.bind(this);
    this.updateTheme = this.updateTheme.bind(this);
  }

  render() {

    /* my apps */
    const myApps = this.props.projects.map(app => {
      return <AppIcon { ...app } key={ 'project' + app.id } type="app" prefix="icon-project-"/>;
    });

    /* installed apps */
    const installedApps = this.props.user.installedApps.map(app => {
      return <AppIcon { ...app } key={ 'app' + app.id } type="app" prefix="icon-app-"/>;
    });

    let apps = [...myApps, ...installedApps];

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
      <AppIcon color="#2ecc71"
               icon="faBook"
               title="Докум-ция"
               key="doc-icon"
               type="doc"
               id="doc-system-app"/>,
    ]

    const groups = {};
    const sortedGroups = [];
    const groupsMarkup = [];

    const settings = [ ...this.props.user.settings ];

    /* sort apps about groups */
    settings.map(setting => {
      const groupName = setting.body.category;
      if (typeof groupName !== 'string' || groupName === '') { return; }

      /* create group property */
      if (!sortedGroups.includes(groupName)) {
        groups[groupName] = {
          apps: [],
          body: '',
        };
        sortedGroups.push(groupName);
      }

      /* find app */
      const sortedApp = apps.find(app => app.props.id === setting.id);

      /* put app to the group */
      groups[groupName].apps.push(sortedApp);

      /* delete sorted app from arr */
      apps = apps.filter(item => item !== sortedApp);
    });

    /* create markup for groups */
    for (let name in groups) {
      groupsMarkup.push( this.createGroup(groups[name].apps, name) );
    }

    /* create markup for apps without group */
    if (apps.length) {
      groupsMarkup.push( this.createGroup(apps,
          'Приложения без группы',
          'Вы можете назначить группы этим приложениям в настройках.') );
    }

    /* push system apps */
    groupsMarkup.push( this.createGroup(systemApps,
        'Системные приложения',
        'Тут располагаются системные приложения. Они нужны для настройки системы и для будущих функций.') );

    /* full screen */
    let fullScreenIcon = <FontAwesomeIcon icon={ faExpand } />;
    if (this.state.fullScreen) { fullScreenIcon = <FontAwesomeIcon icon={ faCompress } />; }

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

      const app = document.getElementById('app'+this.props.appId) ||
        document.getElementById('project'+this.props.appId);

      /* show interpreter */
      app.style.display = 'block';
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
        case 'doc':
          interpreter = <DocApp/>;
          break;
        default:
          break;
      }

      /* set black status bar */
      if (this.props.appState === 'opened' && this.props.appType !== 'app') {
        this.setStatusBar('black');
      }
    }



    /*   ---==== App config ====---   */

    /* update system theme */
    if (this.props.appState === 'closing') {
      process.nextTick(() => this.updateTheme());

    /* set app theme */
    } else if (this.props.appState === 'opened' && this.props.appType === 'app') {

      const app = document.getElementById('app'+this.props.appId) ||
        document.getElementById('project'+this.props.appId);

      /* app config */
      const markup = app.contentDocument || app.contentWindow.document;
      const config = markup.querySelector('*[data-role=config]');

      if (config) {

        /* setup theme */
        const theme = config.getAttribute('data-theme');
        if (theme && theme !== 'auto') {
          this.setStatusBar(theme);
        } else if (!theme) {
          this.setStatusBar('black');
        }
      } else {
        this.setStatusBar('black');
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
              <span> Свернуть </span>
              <span> ▼ </span>
            </div>
            <Link className="box-main" to="/projects">
              <span> Создать </span>
              <span> alt </span>
              <span> <FontAwesomeIcon icon={ faPlus } /> </span>
            </Link>
          </div>
        </div>
        <div className="main-system-page" id="main-system-page">
          <div className="groups-wrap" id="groups-wrap">

            { groupsMarkup }

            <div className="fullview" id="fullScreen">
              { fullScreenIcon }
            </div>
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
    const systemWindow = document.getElementById('main-system-page');
    const systemBackground = document.getElementById('system-pc');

    if (device) {
      systemWindow.style.width = 500 + 'px';
      systemWindow.style.marginRight = 100 + 'px';
      systemWindow.classList.add('main-system-page__pc-mode');

      document.getElementById('fullScreen').style.display = 'none';

      const width = document.getElementById('system-wrap').offsetWidth - systemWindow.offsetWidth - 100;
      systemBackground.classList.add('system-pc__active');
      systemBackground.style.width = width + 'px';
    }

    window.addEventListener('resize', this.resize, device);
    window.addEventListener('keydown', this.keydown);

    document.querySelector('#fullScreen').onclick = () => {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          this.setState({ fullScreen: false });
        } else {
          document.documentElement.requestFullscreen();
          this.setState({ fullScreen: true });
        }
      } catch {
        console.log('full screen error');
      }
    }



    /*   ---==== Theme ====---   */

    this.updateTheme();



    /*   ---==== Alerts ====---   */

    const alerts = new AlertsView(this.props.user.alerts, 'MainPage', this.props.fetchUser);
    alerts.run();



    /*   ---==== Widgets ====---   */

    let widgets = this.props.user.userSettings.widgets;

    if (widgets === undefined) { widgets = []; }

    if (widgets.length > 0) {

      const states = [];

      widgets.forEach(widget => {

        /* connect to the socket room */
        socket.emit('connectToRoom', {
          roomId: widget.roomId,
          roomPass: widget.roomPass,
          currentState: false
        });

        /* fetch widgets statuses */
        const state = request('/core_api/get_property_value', {
          roomId: widget.roomId,
          roomPass: widget.roomPass,
          property: widget.property,
        }).then(res => res.json())
          .then(data => {
            return { res: data, prop: widget.property }
          });

        states.push(state)
      });

      /* update widgets state */
      socket.on('updateState', this.updateWidgets);

      /* set widgets state */
      Promise.all(states).then(data => {
        const statuses = {};
        data.forEach(widgetStatus => {
          statuses[widgetStatus.res.roomId] = {};
          statuses[widgetStatus.res.roomId][widgetStatus.prop] = widgetStatus.res.value;
        });
        this.setState({ widgets: statuses });
      });
    }



    /*   ---==== Caching all apps ====---   */

    /* user */
    localStorage.setItem('user', JSON.stringify(this.props.user));

    /* my apps */
    this.props.projects.forEach(app => {
      request('/api/get_app', { appId: app.id })
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
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
        id={ 'project' + app.id }
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
        id={ 'app' + app.id }
        className="multiTasking-interpreter"
        style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'none' }}
        key={ 'app-' + index }/>;
      interpreters.push(interpreter);
    });

    /* render all interpreters */
    this.setState({ interpreters });

  }

  keydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        this.props.changeAppState({ state: 'closing' });
        break;
      case '=':
        if (!event.altKey) { return; }
        window.location.href = '/projects';
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

  createGroup(apps, name, body = 'Пользовательская группа.') {

    if (this.props.user.userSettings.widgets === undefined) {
      this.props.user.userSettings.widgets = [];
    }

    let widgets = this.props.user.userSettings.widgets
      .filter(widget => widget.category === name);

    /* render widgets */
    if (widgets.length && this.state.widgets) {
      try {
        widgets = widgets.map((widget, i) => {
          return <Widget
            title={ widget.title }
            value={ this.state.widgets[ widget.roomId ][ widget.property ] }
            icon={ widget.icon }
            key={ i }/>
        });
      } catch {
        widgets = null;
      }
    } else { widgets = null; }

    return (
        <div className="app-group" key={ name }>
          <div className="app-group-widget">
            <div className="app-group-widget__title"> { name } </div>
            <div className="app-group-widget__main">
              { body }
            </div>
          </div>
          <div className="widgets">
            { widgets }
          </div>
          <div className="app-group__icons"> { apps } </div>
        </div>
    );
  }

  updateTheme() {
    const theme = this.props.user.userSettings.theme;
    switch (theme) {
      case 1:
        this.setTheme('rgb(243,236,230)', '#F5C6AA');
        break;
      case 2:
        this.setTheme('rgb(237,231,248)', '#A6B1E1');
        break;
      case 3:
        this.setTheme('rgb(224,260,241)', '#62D2A2');
        break;
      case 4:
        this.setTheme('rgb(252,233,227)', '#FFBBCC');
        break;
      default:
        this.setTheme('rgb(243,236,230)', '#F5C6AA');
        break;
    }
  }

  setTheme(color1, color2) {
    document.querySelector('.main-system-page')
        .style.backgroundColor = color1;

    document.querySelector('.fullview')
        .style.backgroundColor = color2;

    document.getElementById('theme-color')
      .setAttribute('content', color1);

    document.getElementById('apple-theme-color')
      .setAttribute('content', color1);
  }

  setStatusBar(color) {
    setTimeout(() => {
      document.getElementById('theme-color')
        .setAttribute('content', color);

      document.getElementById('apple-theme-color')
        .setAttribute('content', color);
    }, 200);
  }

  updateWidgets(data) {

    /* update widgets state */
    const newState = this.state.widgets;
    newState[data.roomId] = { ...newState[data.roomId], ...data.params };
    this.setState({ widgets: newState });
  }

  componentWillUnmount() {

    /* remove event listeners */
    const wrap = document.getElementById('groups-wrap');

    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('resize', this.resize);

    this.props.user.userSettings.widgets.forEach(widget => {
      socket.emit('disconnectFromRoom', widget.roomId);
    });

    document.getElementById('theme-color')
      .setAttribute('content', 'black');

    document.getElementById('apple-theme-color')
      .setAttribute('content', 'black');
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
    fetchUser: () => {
      dispatch(fetchUser())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);