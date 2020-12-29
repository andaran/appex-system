/* React */
import React from 'react';

/* Components */
import { Link } from 'react-router-dom';
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchUser } from "../../../actions/userActions";
import { connect } from "react-redux";

/* Component */
class AppNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadState: false,
    }
  }

  componentDidMount() {

    /* find room settings */
    const id = this.props.app.id;
    const settings = this.props.user.settings.find(elem => elem.id === id);

    if (settings !== undefined) {
      document.getElementById('room-id').value = settings.body.roomId;
      document.getElementById('room-pass').value = settings.body.roomPass;
    }

    /* send settings */
    document.getElementById('send-settings').onclick = () => {
      this.setState({ loadState: true });
      let newUserSettings = this.props.user.settings;

      /* change user settings */
      if (settings !== undefined) {
        newUserSettings = newUserSettings.map(setting => {
          if (setting.id === id) {
            return {
              id, body: {
                ...setting.body,
                roomId: document.getElementById('room-id').value,
                roomPass: document.getElementById('room-pass').value,
              }
            }
          } else { return setting; }
        });
      } else {
        newUserSettings.push({
          id, body: {
            roomId: document.getElementById('room-id').value,
            roomPass: document.getElementById('room-pass').value,
          }
        });
      }

      const body = JSON.stringify({
        settings: newUserSettings,
      });

      fetch('/api/change_user', {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body
      }).then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.setState({ loadState: false });
          this.props.fetchUser();
        }
      });
    }
  }

  render() {

    let buttonIcon;
    if (!this.state.loadState) {
      buttonIcon = 'faLink';
    } else {
      buttonIcon = 'faSpinner';
    }

    return (
      <nav className="app-navbar">
        <div className="app-navbar__block app-navbar__block-1">
          <div className="app-navbar__block app-navbar__item-wrap">
            <div className="app-navbar__item app-navbar__item-logo" style={{ backgroundColor: this.props.app.color }}>
              <FontAwesomeIcon icon={ Icons[this.props.app.icon || 'faMobile'] } />
            </div>
            <div className="app-navbar__item app-navbar__item-name-wrap">
              <div className="app-navbar__item app-navbar__item_name">
                { this.props.app.title }
              </div>
              <div className="app-navbar__item app-navbar__item_text">
                { this.props.app.id }
              </div>
            </div>
          </div>
          <div className="app-navbar__item app-navbar__item-link">
            <span> Настойки </span>
            <span> Alt + S </span>
          </div>
          <div className="app-navbar__item app-navbar__item-link app-navbar__item-connect">
            <span> Подключиться к комнате </span>
            <div className="app-navbar__item-text-inputs">
              <div>
                <input type="text" placeholder="id комнаты" id="room-id" autoComplete="off"/>
                <input type="text" placeholder="пароль" id="room-pass" autoComplete="off"/>
              </div>
              <button id="send-settings"> <FontAwesomeIcon icon={ Icons[buttonIcon] } /> </button>
            </div>
          </div>
          <div className="app-navbar__item app-navbar__item-text">
            <span> | </span>
          </div>
          <div className="app-navbar__item app-navbar__item-link">
            <Link to="/projects"> Проекты </Link>
          </div>
          <div className="app-navbar__item app-navbar__item-link">
            <Link to="/docs"> Документация </Link>
          </div>
          <div className="app-navbar__item app-navbar__item-link">
            <Link to="/main"> Главная </Link>
          </div>
        </div>
        <div className="app-navbar__block app-navbar__block-2">
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Сохранить </span>
            <span> Ctrl + S </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Бекап </span>
            <span> Ctrl + B </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Восстановить </span>
            <span> Ctrl + D </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Релиз </span>
            <span> Ctrl + R </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Выгрузить </span>
            <span> Ctrl + U </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Запустить </span>
            <span> Ctrl + P </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Сменить вид </span>
            <span> Alt + V </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Листать </span>
            <span> Alt + ⯇ </span>
            <span> Alt + ⯈ </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Во весь экран </span>
            <span> Alt + F </span>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.userData.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => {
      dispatch(fetchUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);