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
    }

    // bind
    this.centerMenu = this.centerMenu.bind(this);
    this.setScroll = this.setScroll.bind(this);
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
              <div className="app-group-widget__arrow"/>
            </div>
            <div className="app-group__icons"> 
              { myApps }
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
              {/*<div></div>*/}
            </div>
          </div>
          <div className="app-group">
            <div className="app-group-widget">
              <div className="app-group-widget__title">Сторонние приложения:</div>
              <div className="app-group-widget__main">
                А здесь обитают приложения, которые вы скачали. Нужно загрузить ещё парочку? Тогда вам
                <Link to="/projects"> сюда</Link>.
              </div>
              <div className="app-group-widget__arrow"/>
            </div>
            <div className="app-group__icons"> { installedApps } </div>
          </div>
          <div className="app-group">
            <div className="app-group-widget">
              <div className="app-group-widget__title">Системные приложения:</div>
              <div className="app-group-widget__main">
                Тут располагаются системные приложения. Они нужны для настройки системы и для будущих функций.
              </div>
              <div className="app-group-widget__arrow"/>
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
    let timeout = false;
    document.getElementById("groups-wrap").onscroll = () => {
      timeout && clearTimeout(timeout);

      timeout = setTimeout(() => this.centerMenu(), 50);
    };

    /* scroll points */
    // document.querySelectorAll('.point').addEventListener('click', this.setScroll);
    for (let point of document.querySelectorAll('.point')) {
      point.onclick = this.setScroll;
    }
  }

  centerMenu() {

    /* set phone params */
    const wrap = document.getElementById("groups-wrap");
    const width = document.getElementById('root').offsetWidth;
    const currentScroll = wrap.scrollLeft;
    const page = Math.round(currentScroll / width);

    /* set scroll */
    wrap.scrollTo({
      left: page * width,
      behavior: "smooth"
    });

    /* set current page */
    this.setState({ currentPage: page });
  }

  setScroll(event) {
    const page = [...document.querySelectorAll('.point')].findIndex(n => n === event.target);
    const width = document.getElementById('root').offsetWidth;
    const wrap = document.getElementById("groups-wrap");

    /* set scroll */
    wrap.scrollTo({
      left: page * width,
      behavior: "smooth"
    });

    /* set current page */
    this.setState({ currentPage: page });
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