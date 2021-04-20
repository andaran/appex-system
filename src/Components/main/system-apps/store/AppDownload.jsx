import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {faIdBadge, faKey, faSearch} from "@fortawesome/free-solid-svg-icons";
import {fetchUser} from "../../../../actions/userActions";
import {connect} from "react-redux";

/* Component */
class AppDownload extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.download = this.download.bind(this);
  }

  render() {
    return (
      <div className="app-block">
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
        <div className="reg-window__input-item">
          <div className="reg-window__button reg-window__button_green" id="reg-btn" onClick={ this.send }>
            Скачать
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

  }

  download() {

  }
}


function mapStateToProps(store) {
  return {
    user: store.userData.user,
    projects: store.projects.data,
    apps: store.apps.data,

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