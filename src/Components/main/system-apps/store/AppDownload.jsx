import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {faIdBadge, faKey, faSearch} from "@fortawesome/free-solid-svg-icons";
import {fetchUser} from "../../../../actions/userActions";
import {connect} from "react-redux";
import {request} from "../../../../tools/apiRequest/apiRequest";

/* Component */
class AppDownload extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.clone = this.clone.bind(this);
  }

  render() {

    const id = this.props.id;
    const app = this.props.user.installedApps.find(elem => elem.id === id);

    let button = <div className="reg-window__input-item">
      <div className="reg-window__button reg-window__button_green" onClick={ this.download }>
        Скачать
      </div>
    </div>;

    if (app) {
      button = <div className="reg-window__input-item">
        <div className="reg-window__button reg-window__button_red" onClick={ this.delete }>
          Удалить
        </div>
      </div>;
    }

    return (
      <div className="app-block app-download-block">
        <div className="reg-window__input-item">
          <div className="reg-window__item-block">
            <div className="app-block__icon" style={{ backgroundColor: this.props.color }}>
              <FontAwesomeIcon icon={ Icons[this.props.icon] }/>
            </div>
          </div>
          <div className="reg-window__item-block">
            <input type="text" readOnly={ true } value={ this.props.title } className="reg-window__input"/>
          </div>
        </div>
        { button }
      </div>
    );
  }

  clone() {

    const id = this.props.id;

    // TODO: cloning app

    this.forceUpdate();
  }

  userRequest(params) {
    request(`/api/change_user`, params)
      .then(res => res.json()).then(body => {
      if (body.status === 'ok') {
        this.props.fetchUser();
      } else {
        console.log(body);
      }
    }).catch(err => {
      console.error('Ошибка запроса!\n\n', err);
    });
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDownload);