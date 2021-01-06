/* React */
import React from 'react';

/* Components */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSave, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchRooms } from "../../../actions/roomsActions";
import { connect } from "react-redux";

/* Component */
class RoomCard extends React.Component {
  constructor(args) {
    super(args);

    // bind
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.saveRoom = this.saveRoom.bind(this);

    this.state = {
      deleteFlag: false,
    }
  }

  render() {

    /* render icons */
    let icon = faTrashAlt;
    if (this.state.deleteFlag) {
      icon = faCheckCircle;
    }

    const open = '{';
    const close = '}';

    return (
      <div className="project-card-wrap room-card-wrap" id={`room-wrap-${ this.props.roomId }`}>
        <section className="project-card room-card">
          <pre className="room-card__text">
            { open } <br/>
            &nbsp; name: <input type="text" id={`room-name-${ this.props.roomId }`}/> <br/>
            &nbsp; id: <input type="text" readOnly id={`room-id-${ this.props.roomId }`}/> <br/>
            &nbsp; pass: <input type="text" id={`room-pass-${ this.props.roomId }`}/> <br/>
            { close }
          </pre>
          <div className="icons">
            <div onClick={ this.deleteRoom }
                 id={`confirm-icon-${ this.props.roomId }`}> <FontAwesomeIcon icon={ icon }/> </div>
            <div onClick={ this.saveRoom }
                 id={`save-icon-${ this.props.roomId }`}> <FontAwesomeIcon icon={ faSave }/> </div>
          </div>
        </section>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(`room-wrap-${ this.props.roomId}`)
      .addEventListener('mousemove', this.mousemove);
    document.getElementById(`room-wrap-${ this.props.roomId }`)
      .addEventListener('mouseleave', this.mouseleave);

    /* set props */
    document.getElementById(`room-name-${ this.props.roomId}`).value = this.props.name;
    document.getElementById(`room-id-${ this.props.roomId}`).value = this.props.roomId;
    document.getElementById(`room-pass-${ this.props.roomId}`).value = this.props.roomPass;
  }

  componentWillUnmount() {
    document.getElementById(`room-wrap-${ this.props.roomId}`)
      .removeEventListener('mousemove', this.mousemove);
    document.getElementById(`room-wrap-${ this.props.roomId}`)
      .removeEventListener('mouseleave', this.mouseleave);
  }

  mousemove(event) {
    const cardWrap = document.getElementById(`room-wrap-${ this.props.roomId}`);
    const icon = cardWrap.querySelector('pre');
    const card = cardWrap.querySelector('section');

    let targetCords = cardWrap.getBoundingClientRect();
    let xCord = event.clientX - targetCords.left;
    let yCord = event.clientY - targetCords.top;

    /* Trim */
    xCord /= -10; xCord += 11;
    yCord /= -14.2; yCord += 11;

    /* Выглядит не особо удобно, но выпиливать пока не буду */
    /*
    icon.style.marginLeft = `${xCord * 0.5}px`;
    icon.style.marginTop = `${yCord * 0.5}px`;

    card.style.marginLeft = `${xCord}px`;
    card.style.marginTop = `${yCord}px`;
    */

    card.style.marginTop = `-20px`;

  }

  mouseleave(event) {
    const cardWrap = document.getElementById(`room-wrap-${ this.props.roomId }`);
    const icon = cardWrap.querySelector('pre');
    const card = cardWrap.querySelector('section');

    icon.style.margin = '0';
    card.style.margin = '0';
  }

  deleteRoom() {
    if (!this.state.deleteFlag) {
      this.setState({ deleteFlag: true });
      return;
    }

    /* delete room */
    const body = JSON.stringify({ roomId: this.props.roomId });
    fetch('api/delete_room', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    })
      .then(res => res.json()).then(body => this.props.fetchRooms())
      .catch(() => this.props.fetchRooms());
  }

  saveRoom() {

    const name = document.getElementById(`room-name-${ this.props.roomId}`).value;
    const pass = document.getElementById(`room-pass-${ this.props.roomId}`).value

    /* save changes */
    const body = JSON.stringify({
      roomId: this.props.roomId,
      name, pass
    });
    fetch('api/change_room', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body
    })
      .then(res => res.json()).then(body => this.props.fetchRooms())
      .catch(() => this.props.fetchRooms());
  }
}

function mapStateToProps(store) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRooms: () => {
      dispatch(fetchRooms())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomCard);