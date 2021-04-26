/* React */
import React from 'react';

import { Link } from "react-router-dom";

import RegWindow from '../register/RegWindow/reg-window';

/* Component */
export default class Lending extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      page: 0,
      deltaY: 0,
    }

    // bind
    this.wheel = this.wheel.bind(this);
    this.keydown = this.keydown.bind(this);
  }

  render() {

    const height = document.documentElement.clientHeight;
    return (
      <article className="lending">
        <header style={{ marginTop: this.state.page * height + 'px' }} className="lending-header">
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
              Новейшая система умного дома для самодельных проектов
            </span>
          </main>
          <div className='lending-header_down'>
            <div className="lending-header_space lending-header_space__animate"> space </div>
          </div>
        </header>
        <section className="lending-section">
          <div className="lending-text">
            <div className="lending-text_title">Быстрота</div>
            <div className="lending-text_main">
              Система умного дома appex разрабатывается с упором на быстродействие. Благодаря использованию современных технологий, тщательной оптимизации и гибкости системы через неё можно управлять различными устройствами прямо в реальном времени. Теперь Вашими дронами и роботами можно управлять через интернет из любой точки земного шара!
            </div>
          </div>
          <div className='lending-header_down'>
            <div className="lending-header_space"> space </div>
            <div className="lending-header_arrow"> ▼ </div>
            <div className="lending-header_arrow"> ▲ </div>
          </div>
        </section>
        <section className="lending-section">
          <div className="lending-text">
            <div className="lending-text_title">Кастомизируемость</div>
            <div className="lending-text_main">
              С помощью магии HTML5 и CSS3 Вы можете создавать любые интерфейсы для своих приложений во встроенном редакторе кода. Следом добавьте любую логику на JS, а затем оживите всё это с помощью простого встроенного класса App. Не знаете web? Для этого случая имеется набор готовых элементов от кнопок до джойстиков. Воплотите все свои задумки в жизнь!
            </div>
          </div>
          <div className='lending-header_down'>
            <div className="lending-header_space"> space </div>
            <div className="lending-header_arrow"> ▼ </div>
            <div className="lending-header_arrow"> ▲ </div>
          </div>
        </section>
        <section className="lending-section">
          <div className="lending-text">
            <div className="lending-text_title">Сообщество</div>
            <div className="lending-text_main">
              Обычно умные дома создаются без четкого разделения на устройства, но, как Вы уже поняли, в appex для каждого отдельного устройства создается отдельное приложение. Это позволяет любому пользователю делиться какими угодно частями своего умного дома. Со временем сообщество будет возрастать, а в магазине Вы сможете найти готовое приложение под свои задачи.
            </div>
          </div>
          <div className='lending-header_down'>
            <div className="lending-header_space"> space </div>
            <div className="lending-header_arrow"> ▼ </div>
            <div className="lending-header_arrow"> ▲ </div>
          </div>
        </section>
        <section className="lending-section">
          <div className="lending-text">
            <div className="lending-text_title">Свобода</div>
            <div className="lending-text_main">
              В appex практически нет рамок, а следовательно, нет и ограничений. Это open source проект, поэтому он совершенно бесплатен. Вы можете создавать сколько угодно приложений любой сложности, подключать сколько угодно устройств и совершать до 600 запросов на сервер в минуту. Этого достаточно, чтобы Вас ограничивало только воображение!
            </div>
          </div>
          <div className='lending-header_down'>
            <div className="lending-header_space"> space </div>
            <div className="lending-header_arrow"> ▼ </div>
            <div className="lending-header_arrow"> ▲ </div>
          </div>
        </section>
        <section className="lending-section">
          <RegWindow/>
          <div className='lending-header_down'>
            <div className="lending-header_space lending-header_space__animate"> space </div>
          </div>
        </section>
      </article>
    );
  }

  componentDidMount() {
    document.addEventListener("wheel", this.wheel);
    document.addEventListener("keydown", this.keydown);
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.wheel);
    document.removeEventListener("keydown", this.keydown);
  }

  wheel(event) {
    let deltaY = this.state.deltaY + event.wheelDeltaY;
    let page = Math.floor(deltaY / 2000) + 1;
    if (page < -5) {
      page = -5;
      deltaY = this.state.deltaY;
    }
    if (page > 0) {
      page = 0;
      deltaY = this.state.deltaY;
    }
    this.setState({ deltaY, page });
  }

  keydown(event) {
    if (event.code === 'Space' && this.state.page === -5) {
      return this.setState({ page: 0 });
    }
    if ((event.code === 'Space' || event.code === 'ArrowDown') && this.state.page > -5) {
      this.setState({ page: --this.state.page });
    }
    if (event.code === 'ArrowUp' && this.state.page < 0) {
      this.setState({ page: ++this.state.page });
    }
  }
}