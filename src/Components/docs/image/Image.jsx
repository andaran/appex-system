/* React */
import React from 'react';

/* Component */
export default class Image extends React.Component {

  render() {
    return (
      <img className="doc__image"
           src={`./images/doc/${ this.props.name }`}
           alt="Изображение из документации"/>
    );

  }

  componentDidMount() {

  }
}