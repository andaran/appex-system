import React from 'react';

import { changeAppState } from '../../../actions/appStateActions';
import { connect } from "react-redux";
import { list } from "../../../tools/LastApps/LastApps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
class AppIcon extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.iconClicked = this.iconClicked.bind(this);
  }

  render() {
    return (
      <div className="app-icon">
        <div
          style={{ backgroundColor: this.props.color || '#1abc9c' }}
          id={ this.props.prefix + this.props.id }>
          <FontAwesomeIcon icon={ Icons[this.props.icon || 'faMobile'] } />
        </div>
        <footer>
          { this.props.title || 'application' }
        </footer>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById(this.props.prefix + this.props.id)
      .addEventListener('click', this.iconClicked);
  }

  iconClicked() {

    /* change app state */
    const appState = {
      state: 'opened',
      id: this.props.id || 'system-app',
      type: this.props.type,
    }
    this.props.changeAppState(appState);

    if (this.props.type === 'app') {
      list.append(this.props.id);
    }
  }

  componentWillUnmount() {
    document.getElementById(this.props.prefix + this.props.id)
      .removeEventListener('click', this.iconClicked);
  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppIcon);