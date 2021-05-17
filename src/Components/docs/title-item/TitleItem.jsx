/* React */
import React from 'react';
import { Link } from 'react-router-dom';


/* Component */
export default class TitleItem extends React.Component {

  render() {
    return (
      <Link to={`/doc#${ this.props.to }`}
            className={`title-item title-item_${ this.props.postfix }`}>
        { this.props.title }
      </Link>
    )
  }

  componentDidMount() {

  }
}