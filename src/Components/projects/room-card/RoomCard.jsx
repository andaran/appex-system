/* React */
import React from 'react';

/* Components */

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
      <div className="project-card-wrap" id={`room-wrap-${ this.props.id }`}>
        <section className="project-card">
          test
        </section>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(`room-wrap-${ this.props.id }`).addEventListener('mousemove', this.mousemove);
    document.getElementById(`room-wrap-${ this.props.id }`).addEventListener('mouseleave', this.mouseleave);
  }

  componentWillUnmount() {
    document.getElementById(`room-wrap-${ this.props.id }`).removeEventListener('mousemove', this.mousemove);
    document.getElementById(`room-wrap-${ this.props.id }`).removeEventListener('mouseleave', this.mouseleave);
  }

  mousemove(event) {
    const cardWrap = document.getElementById(`room-wrap-${ this.props.id }`);
    const icon = cardWrap.querySelector('a');
    const card = cardWrap.querySelector('section');

    let targetCords = cardWrap.getBoundingClientRect();
    let xCord = event.clientX - targetCords.left;
    let yCord = event.clientY - targetCords.top;

    /* Trim */
    xCord /= -10; xCord += 11;
    yCord /= -14.2; yCord += 11;

    // icon.style.marginLeft = `${xCord * 2}px`;
    // icon.style.marginTop = `${yCord * 2}px`;

    card.style.marginLeft = `${xCord * 1.5}px`;
    card.style.marginTop = `${yCord * 1.5}px`;
  }

  mouseleave(event) {
    const cardWrap = document.getElementById(`room-wrap-${ this.props.id }`);
    const icon = cardWrap.querySelector('a');
    const card = cardWrap.querySelector('section');

    // icon.style.margin = '0';
    card.style.margin = '0';
  }
}