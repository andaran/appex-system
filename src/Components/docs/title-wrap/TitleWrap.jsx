/* React */
import React from 'react';

import TitleItem from '../title-item/TitleItem';

/* Component */
export default class TitleWrap extends React.Component {

  render() {
    return <div className="title-wrap">
      <TitleItem title="Введение" to="enter"/>
      <TitleItem title="Комнаты" to="rooms"/>
      <TitleItem title="Приложения" to="apps"/>
      <TitleItem title="Настройки" to="settings"/>
      <TitleItem title="Класс App" to="class-app"/>
      <TitleItem title="Эмулятор" to="emulator"/>
      <TitleItem title="Пресеты" to="presets"/>
      <TitleItem title="Своё приложение" to="app-guide"/>
      <TitleItem title="Additional api" to="additional-api"/>
      <TitleItem title="Http core api" to="http-core-api"/>
      <TitleItem title="C++ код" to="C-plus-plus-code"/>
    </div>
  }

  componentDidMount() {

  }
}