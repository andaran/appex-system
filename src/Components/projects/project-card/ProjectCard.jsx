/* React */
import React from 'react';

/* Components */
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import {request} from "../../../tools/apiRequest/apiRequest";
import {fetchUser} from "../../../actions/userActions";
import {fetchProjects} from "../../../actions/projectsActions";
import {connect} from "react-redux";

/* Component */
class ProjectCard extends React.Component {
  constructor(args) {
    super(args);

    // bind
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  render() {
    return (
      <div className="project-card-wrap" id={`card-wrap-${ this.props.id }`}>
        <section className="project-card project-card-clone-available">
          <header className="project-card__header"> { this.props.title || 'application' } </header>
          <div className="project-card__clone"
               onClick={() => this.cloneApp({ appId: this.props.id })}>
            <FontAwesomeIcon icon={ Icons['faClone'] } />
          </div>
          <Link
            style={{ backgroundColor: this.props.color || '#1abc9c' }}
            className="project-card__icon"
            to={`/projects/${ this.props.id }`}>
            <FontAwesomeIcon icon={ Icons[this.props.icon || 'faMobile'] } />
          </Link>
          <footer className="project-card__footer">
            { this.props.id }
          </footer>
        </section>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(`card-wrap-${ this.props.id }`).addEventListener('mousemove', this.mousemove);
    document.getElementById(`card-wrap-${ this.props.id }`).addEventListener('mouseleave', this.mouseleave);
  }

  componentWillUnmount() {
    document.getElementById(`card-wrap-${ this.props.id }`).removeEventListener('mousemove', this.mousemove);
    document.getElementById(`card-wrap-${ this.props.id }`).removeEventListener('mouseleave', this.mouseleave);
  }

  cloneApp(params) {
    request(`/api/create_clone`, params)
      .then(res => res.json()).then(body => {
      if (body.status === 'ok') {
        this.props.fetchProjects();
      } else {
        console.log(body);
        alert('Ошибка клонирования!');
      }
    }).catch(err => {
      console.error('Ошибка запроса!\n\n', err);
      alert('Ошибка клонирования!');
    });
  }

  mousemove(event) {
    const cardWrap = document.getElementById(`card-wrap-${ this.props.id }`);
    const icon = cardWrap.querySelector('a');
    const card = cardWrap.querySelector('section');

    let targetCords = cardWrap.getBoundingClientRect();
    let xCord = event.clientX - targetCords.left;
    let yCord = event.clientY - targetCords.top;

    /* Trim */
    xCord /= -10; xCord += 11;
    yCord /= -14.2; yCord += 11;

    /* Выглядит не особо удобно, но выпиливать пока не буду */
    /*
    icon.style.marginLeft = `${xCord * 2}px`;
    icon.style.marginTop = `${yCord * 2}px`;

    card.style.marginLeft = `${xCord * 1.5}px`;
    card.style.marginTop = `${yCord * 1.5}px`;
    */

    card.style.marginTop = `-20px`;

  }

  mouseleave(event) {
    const cardWrap = document.getElementById(`card-wrap-${ this.props.id }`);
    const icon = cardWrap.querySelector('a');
    const card = cardWrap.querySelector('section');

    icon.style.margin = '0';
    card.style.margin = '0';
  }
}

function mapStateToProps(store) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCard);