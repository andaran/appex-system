import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faCircleNotch} from "@fortawesome/free-solid-svg-icons";

import { fetchUser } from "../../../../actions/userActions";
import { connect } from "react-redux";
import {request} from "../../../../tools/apiRequest/apiRequest";

import AppDownload from "./AppDownload";

/* Component */
class StoreApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
      lastApps: false,
      findApps: false,
    }

    // bind
    this.focusIn = this.focusIn.bind(this);
    this.focusOut = this.focusOut.bind(this);
    this.typing = this.typing.bind(this);
    this.findApps = this.findApps.bind(this);
  }

  render() {

    let lastApps = <div className="apps-loader">
      <FontAwesomeIcon icon={ faCircleNotch }/>
    </div>;
    let findApps = null;

    if (this.state.findApps && this.state.search) {
      findApps = this.state.findApps.map((app, index) => {
        return <AppDownload { ...app } key={index}/>;
      });
    } else if (!this.state.findApps && this.state.search) {
      findApps = <div className="apps-loader">
        <FontAwesomeIcon icon={ faCircleNotch }/>
      </div>;
    }

    if (this.state.lastApps) {
      lastApps = this.state.lastApps.map((app, index) => {
        return <AppDownload { ...app } key={index}/>;
      });
    }

    return (
      <div className="main-settings-wrap main-store-wrap" id="main-store-wrap">
        <div className="main-settings-title">Магазин</div>
        <div className="app-block store-search-block app-download-block" id="search-block">
          <div className="reg-window__input-item">
            <div className="reg-window__item-block">
              <FontAwesomeIcon icon={ faSearch } />
            </div>
            <div className="reg-window__item-block">
              <input type="text"
                     className="reg-window__input"
                     placeholder="Название или ID"
                     id="search"
                     autoComplete="off"/>
            </div>
          </div>
          <div className="reg-window__input-item">
            <div>
              { findApps }
            </div>
          </div>
        </div>
        { lastApps }
      </div>
    );
  }

  componentDidMount() {
    const input = document.getElementById('search');
    input.addEventListener('focusin', this.focusIn);
    input.addEventListener('focusout', this.focusOut);
    input.addEventListener('input', this.typing);

    if (!this.state.lastApps) {
      request('/api/get_last_apps', {})
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            this.setState({ lastApps: body.apps });
          } else {
            console.log('Ahtung in downloading last apps!');
          }
        }).catch(err => {
          console.log('Ahtung in downloading last apps!');
        });

      /*this.setState({ lastApps: [
          {
            title: "Скачаное приложение", icon: "faUtensils", color: "#f1c40f", id: "hHud&snkxkhs&9467"
          },
          {
            title: "Скачаное приложение 2", icon: "faUtensils", color: "#f1c40f", id: "hHui&snkxkhs&9468"
          },
          {
            title: "Скачаное приложение 3", icon: "faUtensils", color: "#f1c40f", id: "hHui&snkxkhs&9469"
          },
          {
            title: "Скачаное приложение 4", icon: "faUtensils", color: "#f1c40f", id: "hHui&snkxkhs&9470"
          }
      ]});*/
    }
  }

  focusIn() {
    document.getElementById('search-block')
      .classList.add('store-search-block_active');
  }

  focusOut() {
    const input = document.getElementById('search');
    if (!this.state.findApps || input.value.length === 0) {
      this.setState({ search: false });
      document.getElementById('search-block')
        .classList.remove('store-search-block_active');
    }
  }

  typing() {
    const input = document.getElementById('search');
    if (input.value.length !== 0) {
      this.findApps(input.value);
      this.setState({ search: true });
    } else {
      this.setState({ search: false });
    }
  }

  findApps(search) {
    request('/api/get_find_apps', { search })
      .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.setState({ findApps: body.apps });
        } else {
          console.log('Ahtung in downloading last apps!');
        }
      }).catch(err => {
        console.log('Ahtung in downloading last apps!');
      });
  }

  componentWillUnmount() {
    const input = document.getElementById('search');
    input.removeEventListener('focusin', this.focusIn);
    input.removeEventListener('focusout', this.focusOut);
    input.removeEventListener('input', this.typing);
  }
}


function mapStateToProps(store) {
  return {
    user: store.userData.user,
    projects: store.projects.data,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreApp);