/* React */
import React from 'react';

/* Components */
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '../../../tools/button/Button';

import { connect } from 'react-redux';
import { switchModalState } from "../../../actions/projectsModalActions";

/* Component */
class CreateAppWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    }

    this.icon = null;

    // bind
    this.tap = this.tap.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
    this.deleteActiveIcon = this.deleteActiveIcon.bind(this);
    this.elementMouseOver = this.elementMouseOver.bind(this);
    this.elementMouseLeave = this.elementMouseLeave.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
  }

  render() {
    let icons = [];
    let keyIndex = 0;

    /* search icons */
    if (this.state.search.length > 0) {
      const reg = new RegExp(this.state.search);
      const wrap = document.getElementById('create-app-window__icons');
      for (let icon in Icons) {
        if (reg.test(icon.toLowerCase()) && icon !== 'fas' && icon !== 'prefix') {
          icons.push(
            <div className="create-app-window__icon"
                 id = {`create-app-window__icon-${keyIndex}`}
                 key = { keyIndex }
                 onClick = { this.changeIcon }>
              <div className="create-app-window__icon-div"
                   data-icon={ icon }
                   onMouseOver= { this.elementMouseOver }
                   onMouseLeave = { this.elementMouseLeave }>
                <FontAwesomeIcon icon={Icons[icon]}/></div>
              <span>{icon.slice(2, icon.length)}</span>
            </div>);
          keyIndex++;
        }
      }
    }

    if (icons.length === 0) icons = <div className="create-app-window__no-icons"> Нет иконок с таким именем! </div>;

    return (
      <div className="modal-content-wrapper create-app-window" id="create-app-window">
        <div className="create-app-window__title"><h4>
          Создать новое приложение:
        </h4></div>
        <div className="create-app-window__input-item">
          <span>Имя приложения: </span>
          <input type="text" autoComplete="false"/>
        </div>
        <div className="create-app-window__item create-app-window__switch-item">
          <span>Возможность скачивать: </span>
          <div>
            <label className="appex-preset-switch create-app-window__switch">
              <input type="checkbox" className="appex-preset-switch__input"/>
              <div className="appex-preset-switch__handle"/>
            </label>
          </div>
        </div>
        <div className="create-app-window__item">
          <span>Цвет иконки: </span>
          <div id="create-app-window__colors">
            <input type="radio" name="change-color" value="#1abc9c" className="create-app-window__input-#1abc9c"/>
            <input type="radio" name="change-color" value="#2ecc71" className="create-app-window__input-#2ecc71"/>
            <input type="radio" name="change-color" value="#3498db" className="create-app-window__input-#3498db"/>
            <input type="radio" name="change-color" value="#9b59b6" className="create-app-window__input-#9b59b6"/>
            <input type="radio" name="change-color" value="#f1c40f" className="create-app-window__input-#f1c40f"/>
            <input type="radio" name="change-color" value="#e67e22" className="create-app-window__input-#e67e22"/>
            <input type="radio" name="change-color" value="#e74c3c" className="create-app-window__input-#e74c3c"/>
            <input type="radio" name="change-color" value="#95a5a6" className="create-app-window__input-#95a5a6"/>
          </div>
        </div>
        <div className="create-app-window__big-item">
          <span>Значек иконки: </span>
          <input type="text" placeholder="название по-английски" id="create-app-window__icon-name" autoComplete="false"/>
          <div id="create-app-window__icons" className="create-app-window__icons">
            { icons }
          </div>
          <small className="create-app-window__small-text">
            Используются значки <a href="https://fontawesome.com/">fontawesome</a>
          </small>
        </div>
        <div className="create-app-window__buttons">
          <div className="create-app-window__err-text" id="create-app-window__err-text"/>
          <div id="buttons" className="create-app-window__buttons-wrap">
            <Button
              size="md"
              background="#e74c3c"
              id="create-app-window__button-close"> Закрыть  </Button>
            <Button
              size="md"
              background="#1abc9c"> Создать! </Button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {

    /* search icon by name */
    const input = document.getElementById('create-app-window__icon-name');
    input.addEventListener('keyup', this.tap);
    document.getElementById('create-app-window__button-close').addEventListener('click', this.closeWindow);

  }

  closeWindow() {
    this.props.switchModalState(true, 'new')
  }

  componentWillUnmount() {
    const input = document.getElementById('create-app-window__icon-name');
    input.removeEventListener('keyup', this.tap);
    document.getElementById('create-app-window__button-close')
      .removeEventListener('click', this.closeWindow);
  }

  changeIcon(event) {
    this.deleteActiveIcon();
    if (event.target !== this.icon) {
      this.icon = event.target;
      event.target.classList.add('create-app-window__icon_active');
    } else {
      this.icon = null;
      event.target.style.backgroundColor = '#3b4148';
      event.target.querySelector('svg').style.backgroundColor = '#3b4148';
      event.target.querySelector('svg').style.color = '#838a91';
    }
  }

  deleteActiveIcon() {
    let icons = document.getElementsByClassName('create-app-window__icon_active');
    for (let icon of icons) {
      icon.classList.remove('create-app-window__icon_active');
      icon.style.backgroundColor = '#3b4148';
      icon.querySelector('svg').style.backgroundColor = '#3b4148';
      icon.querySelector('svg').style.color = '#838a91';
    }
  }

  elementMouseOver(event) {
    const colorsWrap = document.getElementById('create-app-window__colors');
    const input = colorsWrap.querySelector('input:checked');
    let color = 'red';
    input === null ? color = '#3498db' : color = input.value;

    event.target.style.backgroundColor = color;
    event.target.querySelector('svg').style.backgroundColor = color;
    event.target.querySelector('svg').style.color = '#262c31';
  }

  elementMouseLeave(event) {
    if (event.target === this.icon) { return ;}
    event.target.style.backgroundColor = '#3b4148';
    event.target.querySelector('svg').style.backgroundColor = '#3b4148';
    event.target.querySelector('svg').style.color = '#838a91';
  }

  tap(event) {
    this.deleteActiveIcon();
    this.icon = null;
    this.setState({search: event.target.value.toLowerCase()});
    
    /* set background */
    /*if (event.target.value.length > 0) {
      const icons = document.getElementsByClassName('create-app-window__icon-div');
      for (let i = 0; i < icons.length; i++) {
        icons[i].hover.style.background = 'red';
      }
    }*/
  }
}

function mapStateToProps(store) {
  return {
    modal: store.projectsModal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    switchModalState: (state, mode) => {
      dispatch(switchModalState(state, mode))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAppWindow);