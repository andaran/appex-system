/* React */
import React from 'react';

/* Component */
export default class Lending extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      page: 0,
    }
  }

  render() {
    return (
      <article className="lending">
        <header></header>
        <section></section>
        <section></section>
        <section></section>
        <section></section>
      </article>
    );
  }
}