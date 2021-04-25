/* React */
import React from 'react';

/* Component */
export default class Lending extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      page: 0,
      deltaY: 0,
      deltaTouch: false,
      oldScreenY: false,
    }

    // bind
    this.wheel = this.wheel.bind(this);
    this.keydown = this.keydown.bind(this);
    this.swipe = this.swipe.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
  }

  render() {
    const height = document.documentElement.clientHeight;
    return (
      <article className="lending">
        <header style={{ marginTop: this.state.page * height + 'px' }}>1</header>
        <section>2</section>
        <section>3</section>
        <section>4</section>
        <section>5</section>
      </article>
    );
  }

  componentDidMount() {
    document.addEventListener("wheel", this.wheel);
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("touchmove", this.swipe);
    document.addEventListener("touchend", this.swipeEnd);
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.wheel);
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("touchmove", this.swipe);
    document.removeEventListener("touchend", this.swipeEnd);
  }

  wheel(event) {
    let deltaY = this.state.deltaY + event.wheelDeltaY;
    let page = Math.floor(deltaY / 2000) + 1;
    if (page < -4) {
      page = -4;
      deltaY = this.state.deltaY;
    }
    if (page > 0) {
      page = 0;
      deltaY = this.state.deltaY;
    }
    this.setState({ deltaY, page });
  }

  keydown(event) {
    if ((event.code === 'Space' || event.code === 'ArrowDown') && this.state.page > -4) {
      this.setState({ page: --this.state.page });
    }
    if (event.code === 'ArrowUp' && this.state.page < 0) {
      this.setState({ page: ++this.state.page });
    }
  }

  swipe(event) {
    if (!this.state.oldScreenY) {
      this.setState({ oldScreenY: event.touches[0].screenY });
    } else {
      this.setState({ deltaTouch: event.touches[0].screenY });
    }
  }

  swipeEnd(event) {
    const delta = this.state.oldScreenY - this.state.deltaTouch;
    this.setState({ oldScreenY: false });
    if (delta > 0 && this.state.page > -4) {
      this.setState({ page: --this.state.page });
    }
    if (delta < 0 && this.state.page < 0) {
      this.setState({ page: ++this.state.page });
    }
  }
}