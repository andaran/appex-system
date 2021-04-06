/* React */
import React from 'react';

/* Component */
export default class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    let background = null;
    if (this.props.background) {
      background = (
        <div className="background-emulator">
          <iframe
            src={`${ this.props.host }view/${ this.props.id }?devMode=${ this.props.devMode }&back=true`}
            frameBorder="0"
            id="iframe"/>
        </div>
      );
    }

    return (
      <div className="emulators">
        <div className="foreground-emulator">
          <iframe
            src={`${ this.props.host }view/${ this.props.id }?devMode=${ this.props.devMode }&back=false`}
            frameBorder="0"
            id="iframe"/>
        </div>
        { background }
      </div>
    );
  }
}