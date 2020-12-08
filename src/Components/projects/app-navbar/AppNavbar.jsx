/* React */
import React from 'react';

/* Components */
import { Link } from 'react-router-dom';
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '../../../tools/button/Button';

/* Component */
export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="app-navbar">
        <div className="app-navbar__block app-navbar__block-2">
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Сохранить </span>
            <span> Ctrl + S </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Выгрузить </span>
            <span> Ctrl + U </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button">
            <span> Восстановить </span>
            <span> Ctrl + D </span>
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
        </div>
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
          <div className="app-navbar__item app-navbar__item_text-button app-navbar__item_text-button_left">
            <span> Настойки </span>
          </div>
          <div className="app-navbar__item app-navbar__item_text-button app-navbar__item_text-button_left">
            <span> Удалить </span>
          </div>
        </div>
      </nav>
    );
  }
}