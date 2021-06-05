/* React */
import React from 'react';

import { Link } from "react-router-dom";

import RegWindow from '../register/RegWindow/reg-window';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faWrench, faUsers, faShip } from "@fortawesome/free-solid-svg-icons";

/* Component */
export default class Lending extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      page: 0,
      deltaY: 0,
      deltaTouch: false,
      oldScreenX: false,
    }

    // bind
    this.swipe = this.swipe.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
  }

  render() {

    const width = document.documentElement.clientWidth;
    return (
      <div className="lending-mobile-wrap">
        <article className="lending lending-mobile" style={{ marginLeft: this.state.page * width + 'px' }}>
          <header className="lending-header">
            <nav className="lending-header_nav">
              <Link to="/sign_in">вход</Link>
              <Link to="/sign_up">регистрация</Link>
              <Link to="/doc">документация</Link>
            </nav>
            <main>
              <div className="box-title" style={{ transform: "scale(2)" }}>
                <img src="./images/appex.svg" alt="a" className="box-title__img" />
                <span className="box-title__text"> ppex </span>
              </div>
              <span className="lending-description">
                Новейшая система умного дома для <br/> самодельных проектов
              </span>
            </main>
            <div className="lending-header_down lending-header_down__animate">
              <div className="lending-header_swipe"/>
            </div>
          </header>
          <section className="lending-section">
            <div className="lending-text">
              <div className="lending-text_title">Быстрота</div>
              <div className="lending-text_main">
                Система умного дома appex разрабатывается с упором на быстродействие. Благодаря использованию современных технологий, тщательной оптимизации и гибкости системы через неё можно управлять различными устройствами прямо в реальном времени. Теперь Вашими дронами и роботами можно управлять через интернет из любой точки земного шара!
              </div>
            </div>
            <div className="lending-icon">
              <FontAwesomeIcon icon={ faFire } />
            </div>
          </section>
          <section className="lending-section">
            <div className="lending-text">
              <div className="lending-text_title">Кастомизируемость</div>
              <div className="lending-text_main">
                С помощью магии HTML5 и CSS3 Вы можете создавать любые интерфейсы для своих приложений во встроенном редакторе кода. Следом добавьте любую логику на JS, а затем оживите всё это с помощью простого встроенного класса App. Не знаете web? Для этого случая имеется набор готовых элементов от кнопок до иконок. Воплотите все свои задумки в жизнь!
              </div>
            </div>
            <div className="lending-icon">
              <FontAwesomeIcon icon={ faWrench } />
            </div>
          </section>
          <section className="lending-section">
            <div className="lending-text">
              <div className="lending-text_title">Сообщество</div>
              <div className="lending-text_main">
                Обычно умные дома создаются без четкого разделения на устройства, но, как Вы уже поняли, в appex для каждого отдельного устройства создается отдельное приложение. Это позволяет любому пользователю делиться какими угодно частями своего умного дома. Со временем сообщество будет возрастать, а в магазине Вы сможете найти готовое приложение под свои задачи.
              </div>
            </div>
            <div className="lending-icon">
              <FontAwesomeIcon icon={ faUsers } />
            </div>
          </section>
          <section className="lending-section">
            <div className="lending-text">
              <div className="lending-text_title">Свобода</div>
              <div className="lending-text_main">
                В appex практически нет рамок, а следовательно, нет и ограничений. Это бесплатный проект, который в дальнейшем пойдет на open source. Вы можете создавать сколько угодно приложений любой сложности, подключать сколько угодно устройств и совершать до 600 запросов на сервер в минуту. Этого достаточно, чтобы Вас ограничивало только воображение!
              </div>
            </div>
            <div className="lending-icon">
              <FontAwesomeIcon icon={ faShip } />
            </div>
          </section>
          <section className="lending-section">
            <RegWindow/>
          </section>
        </article>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener("touchmove", this.swipe);
    document.addEventListener("touchend", this.swipeEnd);
  }

  componentWillUnmount() {
    document.removeEventListener("touchmove", this.swipe);
    document.removeEventListener("touchend", this.swipeEnd);
  }

  swipe(event) {
    if (!this.state.oldScreenX) {
      this.setState({ oldScreenX: event.touches[0].screenX });
    } else {
      this.setState({ deltaTouch: event.touches[0].screenX });
    }
  }

  swipeEnd(event) {
    const delta = this.state.oldScreenX - this.state.deltaTouch;
    this.setState({ oldScreenX: false, deltaTouch: 0 });
    if (delta > 50 && this.state.page > -5) {
      this.setState({ page: --this.state.page });
    }
    if (delta < -50 && this.state.page < 0) {
      this.setState({ page: ++this.state.page });
    }
  }
}