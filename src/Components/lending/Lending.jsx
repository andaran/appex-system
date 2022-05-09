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
    this.stopAnimate = () => {};

    // bind
    this.wheel = this.wheel.bind(this);
    this.keydown = this.keydown.bind(this);
    this.animate = this.animate.bind(this);
  }

  render() {

    /* find device */
    const mobileDevices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");

    let buttons = (
      <div className='lending-header_down'>
        <div className="lending-header_space lending-header_space__animate"> space </div>
        <div className="lending-header_arrow lending-header_arrow__animate1"> ▼ </div>
        <div className="lending-header_arrow lending-header_arrow__animate2"> ▲ </div>
      </div>
    );
    let mobileButtons = null;
    if (mobileDevices.test(navigator.userAgent)) {
      buttons = null;
      mobileButtons = (
        <div className="lending-header_mobile-controls">
          <div className="lending-header_mobile-button"
               onClick={ () => this.keydown({ code: 'ArrowUp' }) }> ▲ </div>
          <div className="lending-header_mobile-button"
               onClick={ () => this.keydown({ code: 'ArrowDown' }) }> ▼ </div>
        </div>
      );
    }

    const height = window.innerHeight;
    return (
      <article className="lending">
        { mobileButtons }
        <header style={{ marginTop: this.state.page * height + 'px' }} className="lending-header">
          <nav className="lending-header_nav">
            <Link to="/sign_in">вход</Link>
            <Link to="/sign_up">регистрация</Link>
            <Link to="/main">главная</Link>
            <Link to="/doc">документация</Link>
          </nav>
          <main>
            <div className="box-title" style={{ transform: "scale(2)" }}>
              <img src="./images/appex.svg" alt="a" className="box-title__img" />
              <span className="box-title__text"> ppex </span>
            </div>
            <span className="lending-description">
              Open source система удаленного управления для любых устройств. <br/>
              Github: <a href="https://github.com/andaran/appex-system/">
                github.com/andaran/appex-system</a>
            </span>
          </main>
          { buttons }
        </header>
        <section className={`lending-section active-slide-1-${-this.state.page}`}>
          <div className="lending-text">
            <div className="lending-text_title">Шаг 1</div>
            <div className="lending-text_main">
              Создайте приложение и комнату для него.
            </div>
          </div>
          { buttons }
          <video src="./videos/step_1.mp4" autoPlay loop muted />
        </section>
        <section className={`lending-section active-slide-2-${-this.state.page}`}>
          <div className="lending-text">
            <div className="lending-text_title">Шаг 2</div>
            <div className="lending-text_main">
              Напишите код для приложения.
            </div>
          </div>
          { buttons }
          <video src="./videos/step_2.mp4" autoPlay loop muted />
        </section>
        <section className={`lending-section active-slide-3-${-this.state.page}`}>
          <div className="lending-text">
            <div className="lending-text_title">Шаг 3</div>
            <div className="lending-text_main">
              Напишите код для микроконтроллера.
            </div>
          </div>
          { buttons }
          <video src="./videos/step_3.mp4" autoPlay loop muted />
        </section>
        <section className={`lending-section active-slide-4-${-this.state.page}`}>
          <div className="lending-text">
            <div className="lending-text_title">Шаг 4</div>
            <div className="lending-text_main">
              Управляйте устройством!
            </div>
          </div>
          { buttons }
          <video src="./videos/step_4.mp4" autoPlay loop muted />
        </section>
        <section className={`lending-section active-slide-5-${-this.state.page}`}>
          <RegWindow/>
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
    clearTimeout(this.timeout);
    this.stopAnimate();
    if (event.code === 'Space' && this.state.page === -5) {
      return this.setState({ page: 0 });
    }
    if ((event.code === 'Space' || event.code === 'ArrowDown') && this.state.page > -5) {
      this.setState({ page: --this.state.page });
      this.animate();
    }
    if (event.code === 'ArrowUp' && this.state.page < 0) {
      this.setState({ page: ++this.state.page });
      this.animate();
    }
  }

  animate() {
    if (this.state.page === -5) return;
    if (this.state.page === 0) return;
    setTimeout(() => {
      const section = document.querySelector(`.active-slide-${ -this.state.page }-${ -this.state.page }`)
      const textBlock = section.querySelector('.lending-text_main');
      const text = textBlock.innerText.slice();
      textBlock.innerText = '';

      this.stopAnimate = () => textBlock.innerText = text;

      const addSmb = (n) => {
        text[n] === ' '
          ? textBlock.innerText += text[n] + text[++n]
          : textBlock.innerText += text[n];
        if (++n < text.length) this.timeout = setTimeout(() => addSmb(n), 70);
      }

      addSmb(0);
    });
  }
}