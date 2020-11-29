import React from 'react';

/* Component */
export default class Error404 extends React.Component {
  render() {
    return (
      <div className="error-404">
        <div>
          <div className="error-404__message">404</div>
          <span className="error-404__text">
            В бескрайних просторах вселенной не нашлось приложения с таким id :(
          </span>
        </div>
      </div>
    );
  }
}