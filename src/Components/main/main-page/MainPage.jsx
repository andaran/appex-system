import React from 'react';

import { fetchProjects, changeProjects } from '../../../actions/projectsActions';
import { switchModalState } from "../../../actions/projectsModalActions";
import { connect } from "react-redux";

import { app } from '../../../socketCore';

import SystemNavbar from '../system-navbar/SystemNavbar';
import AppIcon from '../app-icon/AppIcon';
import {Link} from "react-router-dom";

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
  }

  render() {

    /* my apps */
    let myApps = this.props.projects.map(app => {
      return <AppIcon { ...app }/>;
    });

    /* my apps test */
    /*let myApps = [];
    for (let i = 0; i < 50; i++) {
      myApps.push(<AppIcon { ...this.props.projects[0] }/>)
    }*/

    /* installed apps */
    let installedApps = this.props.user.installedApps.map(app => {
      return <AppIcon { ...app }/>;
    });

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

    return (
      <div className="main-system-page">
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
            <div className="app-group__icons"></div>
          </div>
        </div>
        <div className="page-number">
          { points }
        </div>
      </div>
    );
  }

  componentDidMount() {

    /* scroll the menu */
    const wrap = document.getElementById('groups-wrap');

    wrap.addEventListener('touchstart', this.touchStart);
    wrap.addEventListener('touchend', this.touchEnd);
    wrap.addEventListener('touchmove', this.touchMove);
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

    /* move page and save params */
    const currentPage = this.state.currentPage + deltaPage;
    this.setState({ touchStart: 0, currentPage });

    wrap.style.transition = '.2s ease-out';
    wrap.style.left = (-1 * currentPage * width) + 'px';
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

  // componentWillUnmount() {
  //   document.querySelectorAll("point").removeEventListener('click', this.setScroll);
  // }
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

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);