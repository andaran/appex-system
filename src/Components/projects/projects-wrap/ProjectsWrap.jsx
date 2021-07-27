/* React */
import React from 'react';

/* Components */
import Navbar from '../navbar/Navbar';
import Card from '../project-card/ProjectCard';
import CloneCard from "../clone-card/CloneCard";
import Room from '../room-card/RoomCard';
import Window from '../create-app-window/CreateAppWindow';
import Wrap from '../../../tools/modal-wrap/ModalWrap';

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from 'react-redux';
import { fetchProjects } from '../../../actions/projectsActions';
import { fetchRooms } from '../../../actions/roomsActions';
import { fetchUser } from "../../../actions/userActions";
import { switchModalState } from '../../../actions/projectsModalActions';
import Message from "../../../tools/message/Message";

import AlertsView from "../../../tools/alerts/alertsView";

/* Component */
class ProjectsWrap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: false,
      cloneParams: false,
    }

    // bind
    this.newProject = this.newProject.bind(this);
    this.cloneSettings = this.cloneSettings.bind(this);
    this.close = this.close.bind(this);
    this.newRoom = this.newRoom.bind(this);
  }

  render() {

    /* all cards */
    let apps = null;
    let clones = null;
    if (!this.props.projectsIsFetching && !this.props.projectsError) {

      /* apps */
      apps = this.props.projects.map((props, index) => {
        return (
          <Card { ...props } key = { index }/>
        );
      });

      /* clones */
      clones = this.props.projects.map((props, index) => {
        return (
          <CloneCard { ...props }
                     key = { index }
                     cloneSettings = { this.cloneSettings }/>
        );
      });

      clones = clones.filter(item => item.props.type === 'clone');
      apps = apps.filter(item => item.props.type === 'app');
    }

    /* all rooms */
    let rooms = null;
    if (!this.props.roomsIsFetching && !this.props.roomsError) {
      rooms = this.props.rooms.map((props, index) => {
        return (
          <Room { ...props } key = { index }/>
        );
      });
    }

    /* clones */
    let clonedApps = null;
    let hr = null;
    if (clones && clones.length > 0) {
      clonedApps = (
        <div className="projects-wrap">
          <article className="cards">
            { clones }
          </article>
        </div>
      );
      hr = <hr/>;
    }

    /* rendering window */
    let modal;
    this.props.modal.status? modal = <Wrap for={ <Window { ...this.state.cloneParams }/> } />: modal = null;

    /* render message */
    let message = null;
    if (this.state.message) {
      message = <Message { ...this.state.message }/>;
      setTimeout(() => {
        this.setState({ message: false });
      }, 600);
    }

    return (
      <div>
        { modal }
        { message }
        <Navbar path="./images/appex.svg" />
        <div className="projects-wrap">
          <article className="cards">
            {/*  <Card
            title="макароно-варка"
            icon="faUtensils"
            color="#3498db"
            id="hGud&snkxkhs&6467"
           />  */}

            { apps }

            <div className="project-card-wrap"  id="project-card-plus-wrap">
              <section className="project-card_plus" id="project-card__plus">
                <div className="project-card__plus-wrap">
                  <FontAwesomeIcon icon={ faPlus } />
                </div>
              </section>
            </div>
          </article>
        </div>
        { hr } { clonedApps }
        <hr/>
        <div className="projects-wrap">
          <article className="cards">
            {/*  <Room
            title="макароно-варка"
            icon="faUtensils"
            color="#3498db"
            id="hGud&snkxkhs&6467"
           />  */}

            { rooms }

            <div className="project-card-wrap"  id="room-card-plus-wrap">
              <section className="project-card_plus room-card_plus" id="room-card__plus">
                <div className="project-card__plus-wrap room-card__plus-wrap">
                  <FontAwesomeIcon icon={ faPlus } />
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const projectCard = document.getElementById(`project-card-plus-wrap`);
    projectCard.addEventListener('mousemove', { handleEvent: this.mousemove, target: projectCard });
    projectCard.addEventListener('mouseleave', { handleEvent: this.mouseleave, target: projectCard });

    const roomCard = document.getElementById(`room-card-plus-wrap`);
    roomCard.addEventListener('mousemove', { handleEvent: this.mousemove, target: roomCard });
    roomCard.addEventListener('mouseleave', { handleEvent: this.mouseleave, target: roomCard });

    if (!this.props.projectsFulfilled && !this.props.projectsIsFetching) {
      this.props.fetchProjects();
    }

    if (this.props.projectsError) {
      console.log('Неизвестная ошибка загрузки проектов!');
      this.setState({message: { type: false, text: 'Неизвестная ошибка загрузки проектов!'}});
    }

    if (!this.props.roomsFulfilled && !this.props.roomsIsFetching) {
      this.props.fetchRooms();
    }

    if (this.props.roomsError) {
      console.log('Неизвестная ошибка загрузки проектов!');
      this.setState({message: { type: false, text: 'Неизвестная ошибка загрузки комнат!'}});
    }

    document.getElementById(`project-card-plus-wrap`).addEventListener('click', this.newProject);
    document.getElementById(`room-card-plus-wrap`).addEventListener('click', this.newRoom);



    /*   ---==== Alerts ====---   */

    const alerts = new AlertsView(this.props.user.alerts, 'ProjectsWrap', this.props.fetchUser);
    alerts.run();
  }

  componentWillUnmount() {
    document.getElementById(`project-card-plus-wrap`).removeEventListener('mousemove', this.mousemove);
    document.getElementById(`project-card-plus-wrap`).removeEventListener('mouseleave', this.mouseleave);
    document.getElementById(`project-card-plus-wrap`).removeEventListener('click', this.newProject);
    document.getElementById(`room-card-plus-wrap`).removeEventListener('click', this.newRoom);

    document.getElementById(`room-card-plus-wrap`).removeEventListener('mousemove', this.mousemove);
    document.getElementById(`room-card-plus-wrap`).removeEventListener('mouseleave', this.mouseleave);
  }

  newProject() {
    this.props.switchModalState(this.props.modal.status, 'new');
  }

  cloneSettings(cloneParams) {
    this.setState({ cloneParams });
    this.props.switchModalState(this.props.modal.status, 'set');
  }

  newRoom() {

    /* create new room */
    fetch('api/create_room', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json()).then(body => this.props.fetchRooms())
      .catch(() => this.props.fetchRooms());
  }

  close() {
    this.setState({
      modal: false
    })
  }

  mousemove(event) {
    let iconWrap = this.target;
    let icon = iconWrap.querySelector('.project-card_plus');

    let targetCords = iconWrap.getBoundingClientRect();
    let xCord = event.clientX - targetCords.left;
    let yCord = event.clientY - targetCords.top;

    /* Trim */
    xCord /= -10; xCord += 11;
    yCord /= -14.2; yCord += 11;

    icon.style.marginLeft = `${xCord * 2}px`;
    icon.style.marginTop = `${yCord * 2}px`;
  }

  mouseleave(event) {
    let icon = this.target.querySelector('.project-card_plus');
    icon.style.margin = '0';
  }
}

function mapStateToProps(store) {
  return {

    /* projects */
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
    projectsError: store.projects.error,
    projectsFulfilled: store.projects.fulfilled,

    /* modal */
    modal: store.projectsModal,

    /* user */
    user: store.userData.user,

    /* rooms */
    rooms: store.rooms.data,
    roomsIsFetching: store.rooms.isFetching,
    roomsError: store.rooms.error,
    roomsFulfilled: store.rooms.fulfilled,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    },
    fetchRooms: () => {
      dispatch(fetchRooms())
    },
    switchModalState: (state, mode) => {
      dispatch(switchModalState(state, mode))
    },
    fetchUser: () => {
      dispatch(fetchUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsWrap);