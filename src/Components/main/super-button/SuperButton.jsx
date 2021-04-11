import React from 'react';

import { changeAppState } from "../../../actions/appStateActions";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import LastApps from "../../../tools/LastApps/LastApps";
import { list } from "../../../tools/LastApps/LastApps";

/* Component */
class SuperButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: Date.now(),
      touch: false,

      wrapStart: 0,
      wrapGo: false,
      wrapTo: false,
    }


    // bind
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.close = this.close.bind(this);

    this.wrapTouchStart = this.wrapTouchStart.bind(this);
    this.wrapTouchEnd = this.wrapTouchEnd.bind(this);
    this.wrapTouchMove = this.wrapTouchMove.bind(this);
  }

  render() {
    return (
      <div>
        <div className="super-button"
             id="super-button"
             onClick={() => this.props.changeAppState({ state: 'closing' })}>
          <FontAwesomeIcon icon={ faTimes } className="super-button__knob" id="super-button__knob"/>
        </div>
        <div id="swipe-wrap" style={{ display: 'none' }}/>
      </div>
    );
  }

  componentDidMount() {
    const button = document.getElementById('super-button');
    button.addEventListener('touchstart', this.touchStart);
    button.addEventListener('touchmove', this.touchMove);
    button.addEventListener('touchend', this.touchEnd);
    button.addEventListener('click', this.close);

    const wrap = document.getElementById('swipe-wrap');
    wrap.addEventListener('touchstart', this.wrapTouchStart);
    wrap.addEventListener('touchmove', this.wrapTouchMove);
    wrap.addEventListener('touchend', this.wrapTouchEnd);
    wrap.addEventListener('touchcancel', this.wrapTouchEnd);
  }

  touchStart(event) {
    const button = document.getElementById('super-button');
    this.setState({ startTime: Date.now(), touch: true });
    document.body.style.userSelect = 'none';

    /* vibrate */
    setTimeout(() => {
      if (!this.state.touch) { return; }
      if ('vibrate' in navigator) {
        navigator.vibrate([13, 15, 13, 15, 13]);
      }
    }, 300);
  }

  touchEnd(event) {
    const button = document.getElementById('super-button');
    button.style.transform = 'scale(1)';

    document.body.style.userSelect = 'auto';
    this.setState({ touch: false });
  }

  touchMove(event) {
    if (Date.now() - this.state.startTime < 300) { return; }

    const button = document.getElementById('super-button');
    button.style.transform = 'scale(0.9)';
    button.style.left = event.touches[event.touches.length - 1].pageX - 20 + 'px';
    button.style.top = event.touches[event.touches.length - 1].pageY - 20 +'px';
  }

  close() {
    if (Date.now() - this.state.startTime >= 300) { return; }
    this.props.changeAppState({ state: 'closing' });
  }

  wrapTouchStart(event) {
    this.setState({ wrapStart: event.touches[event.touches.length - 1].pageX });
  }

  wrapTouchMove(event) {
    event.preventDefault();
    let pageX = event.touches[event.touches.length - 1].pageX;
    if (this.state.wrapStart - pageX > 50) {
      if (!this.state.wrapGo) {
        navigator.vibrate([20, 15, 20]);
        this.setState({ wrapGo: true, wrapTo: 'right' });
      }
    } else if (this.state.wrapStart - pageX < -50) {
      if (!this.state.wrapGo) {
        navigator.vibrate([20, 15, 20]);
        this.setState({ wrapGo: true, wrapTo: 'left' });
      }
    } else if (this.state.wrapGo) {
      this.setState({ wrapGo: false, wrapTo: false });
    }
  }

  wrapTouchEnd() {
    if (this.state.wrapTo) {
      let id;
      this.state.wrapTo === 'left'
        ? id = list.left()
        : id = list.right();

      if (id) {

        /* close all apps */
        const nodeList = document.querySelectorAll('.multiTasking-interpreter');
        const interpreters = Array.from(nodeList);

        interpreters.forEach(node => {
          node.style.display = 'none';
        });

        /* change new app */
        this.props.changeAppState({ id });
      }
    }

    this.setState({ wrapGo: false, wrapTo: false });
  }

  componentWillUnmount() {
    const button = document.getElementById('super-button');
    button.removeEventListener('touchstart', this.touchStart);
    button.removeEventListener('touchmove', this.touchMove);
    button.removeEventListener('touchend', this.touchEnd);
    button.removeEventListener('click', this.close);

    const wrap = document.getElementById('swipe-wrap');
    wrap.removeEventListener('touchstart', this.wrapTouchStart);
    wrap.removeEventListener('touchmove', this.wrapTouchMove);
    wrap.removeEventListener('touchend', this.wrapTouchEnd);
    wrap.removeEventListener('touchcancel', this.wrapTouchEnd);
  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* app state */
    appState: store.appState.state,
    appId: store.appState.id,
    appType: store.appState.type,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperButton);