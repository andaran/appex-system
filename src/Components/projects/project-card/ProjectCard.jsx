/* React */
import React from 'react';

/* Components */
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

/* Component */
export default class ProjectCard extends React.Component {
  constructor(args) {
    super(args);

    // bind
    this.mousemove = this.mousemove.bind(this);
    this.mouseleave = this.mouseleave.bind(this);
  }

  render() {
    return (
      <div className="project-card-wrap" id={`card-wrap-${ this.props.id }`}>
        <section className="project-card">
          <header className="project-card__header"> { this.props.title || 'application' } </header>
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

    icon.style.marginLeft = `${xCord * 2}px`;
    icon.style.marginTop = `${yCord * 2}px`;

    card.style.marginLeft = `${xCord * 1.5}px`;
    card.style.marginTop = `${yCord * 1.5}px`;
  }

  mouseleave(event) {
    const cardWrap = document.getElementById(`card-wrap-${ this.props.id }`);
    const icon = cardWrap.querySelector('a');
    const card = cardWrap.querySelector('section');

    icon.style.margin = '0';
    card.style.margin = '0';
  }
}