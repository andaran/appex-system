import React from 'react';

import { changeAppState } from "../../../actions/appStateActions";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

/* Component */
class SuperButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: Date.now(),
      touch: false,
    }


    // bind
    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.close = this.close.bind(this);
  }

  render() {

    return (
      <div className="super-button"
           id="super-button"
           onClick={() => this.props.changeAppState({ state: 'closing' })}>
        <FontAwesomeIcon icon={ faTimes } className="super-button__knob" id="super-button__knob"/>
      </div>
    );
  }

  componentDidMount() {
    const button = document.getElementById('super-button');
    button.addEventListener('touchstart', this.touchStart);
    button.addEventListener('touchmove', this.touchMove);
    button.addEventListener('touchend', this.touchEnd);
    button.addEventListener('click', this.close);
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

  componentWillUnmount() {
    const button = document.getElementById('super-button');
    button.removeEventListener('touchstart', this.touchStart);
    button.removeEventListener('touchmove', this.touchMove);
    button.removeEventListener('touchend', this.touchEnd);
    button.removeEventListener('click', this.close);
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