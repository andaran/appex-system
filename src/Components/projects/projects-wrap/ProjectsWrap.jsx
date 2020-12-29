/* React */
import React from 'react';

/* Components */
import Navbar from '../navbar/Navbar';
import Card from '../project-card/ProjectCard';
import Window from '../create-app-window/CreateAppWindow';
import Wrap from '../../../tools/modal-wrap/ModalWrap';

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from 'react-redux';
import { fetchProjects } from '../../../actions/projectsActions';
import { switchModalState } from '../../../actions/projectsModalActions';
import Message from "../../../tools/message/Message";

/* Component */
class ProjectsWrap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: false,
    }

    // bind
    this.newProject = this.newProject.bind(this);
    this.close = this.close.bind(this);
  }

  render() {

    /* all cards */
    let cards = null;
    if (!this.props.projectsIsFetching && !this.props.projectsError) {
      cards = this.props.projects.map((props, index) => {
        return (
          <Card { ...props } key = { index }/>
        );
      });
    }

    /* rendering window */
    let modal;
    this.props.modal.status? modal = <Wrap for={ <Window/> } />: modal = null;

    /* render message */
    let message = null;
    if (this.state.message) {
      message = <Message { ...this.state.message }/>;
      setTimeout(() => {
        this.setState({ message: false });
      }, 600);
    }

    return (
      <div className="project s-wrap">
        { modal }
        { message }
        <Navbar path="./images/appex.svg" />
        <article className="cards">
          {/*  <Card
            title="макароно-варка"
            icon="faUtensils"
            color="#3498db"
            id="hGud&snkxkhs&6467"
           />  */}

          { cards }

          <div className="project-card-wrap"  id="project-card-plus-wrap">
            <section className="project-card_plus" id="project-card__plus">
              <div className="project-card__plus-wrap">
                <FontAwesomeIcon icon={ faPlus } />
              </div>
            </section>
          </div>
        </article>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(`project-card-plus-wrap`).addEventListener('mousemove', this.mousemove);
    document.getElementById(`project-card-plus-wrap`).addEventListener('mouseleave', this.mouseleave);

    if (this.props.projects.length === 0 && !this.props.projectsIsFetching) {
      this.props.fetchProjects(this.props.user.username, this.props.user.id);
    }

    if (this.props.projectsError) {
      console.log('Неизвестная ошибка загрузки проектов!');
      this.setState({message: { type: false, text: 'Неизвестная ошибка загрузки проектов!'}});
    }

    document.getElementById(`project-card-plus-wrap`).addEventListener('click', this.newProject);
  }

  componentWillUnmount() {
    document.getElementById(`project-card-plus-wrap`).removeEventListener('mousemove', this.mousemove);
    document.getElementById(`project-card-plus-wrap`).removeEventListener('mouseleave', this.mouseleave);
    document.getElementById(`project-card-plus-wrap`).removeEventListener('click', this.newProject);
  }

  newProject() {
    this.props.switchModalState(this.props.modal.status, 'new');
  }

  close() {
    this.setState({
      modal: false
    })
  }

  mousemove(event) {
    const iconWrap = document.getElementById(`project-card-plus-wrap`);
    const icon = document.getElementById(`project-card__plus`);

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
    const icon = document.getElementById(`project-card__plus`);
    icon.style.margin = '0';
  }
}

function mapStateToProps(store) {
  return {
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
    projectsError: store.projects.error,
    modal: store.projectsModal,
    user: store.userData.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: (username, id) => {
      dispatch(fetchProjects(username, id))
    },
    switchModalState: (state, mode) => {
      dispatch(switchModalState(state, mode))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsWrap);