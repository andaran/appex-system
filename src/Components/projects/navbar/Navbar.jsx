/* React */
import React from 'react';

/* Components */
import { Link } from 'react-router-dom';

/* Component */
export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar">
        <div className="navbar__logo">
          <img src={ this.props.path } alt="a" className="navbar__logo-img" />
          <span className="navbar__logo-text"> ppex </span>
        </div>
        <div className="navbar__items">
          <div className="navbar__item">
            <Link className="navbar__link" to="/projects"> Проекты </Link>
          </div>
          <div className="navbar__item">
            <Link className="navbar__link" to="/doc"> Документация </Link>
          </div>
          <div className="navbar__item">
            <Link className="navbar__link" to="/main"> Главная </Link>
          </div>
        </div>
      </nav>
    );
  }
}