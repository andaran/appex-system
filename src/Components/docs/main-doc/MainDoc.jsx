/* React */
import React from 'react';

import DocItem from "../doc-item/DocItem";
import Image from "../image/Image";
import Code from "../code/Code";

/* Component */
export default class MainDoc extends React.Component {

  render() {

    const codes = [
`/* начальное состояние */
App.state = {
    status: false,
}`,
`/* настройки */
App.settings = {
    awaitResponse: true,
}`,`/* обновление состояния */
App.on('update', state => {
    console.log('new state:', state);
});`,`/* ошибка */
App.on('err', err => {
    console.log('err:', err);
});`,`App.send({ status: !App.state.status });`,
`App.start();`,
`[[Button
  background="#48dbfb"
  size="md"  <!-- sm - 30px, md - 50px, lg - 70px, -->
  text="кнопка"
  name="btn"
]]`, `[[Switch name="sw"]]`,
`[[Icon name="faPowerOff"]]`, `<!-- обертка приложения -->
<div class="app-wrap">

    <!-- кружок за кнопкой -->
    <div class="app-button-wrap" id="app-button-wrap">

        <!-- кнопка -->
        <div class="app-button" id="app-button">

            <!-- иконка -->
            [[Icon name="faPowerOff"]]
        </div>
    </div>
</div>
`, `/* обертка приложения */
.app-wrap {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* кружок за кнопкой */
.app-button-wrap {
    width: 120px;
    height: 120px;
    background: #c8d6e5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.8;
    transition: .5s;
}

/* кнопка */
.app-button {
    width: 110px;
    height: 110px;
    background: white;
    border-radius: 50%;
    color: #c8d6e5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    transition: .1s;
}

/* кнопка при клике */
.app-button:active {
    transform: scale(.98);
}
`, `/* начальное состояние */
App.state = {
  status: true,
}

/* настройки */
App.settings = {
  awaitResponse: true,
}`, `/* ищем кнопку и фон */
const button = document.getElementById('app-button');
const wrap = document.getElementById('app-button-wrap');

/* вешаем слушатели событий */
button.addEventListener('click', () => {
  App.send({ status: !App.state.status });
  window.navigator.vibrate(40);
});`, `/* обновление состояния */
App.on('update', state => {
  if (state.status) {
    button.style.color = '#00d2d3';
    wrap.style.backgroundColor = '#00d2d3';
  } else {
    button.style.color = '#c8d6e5';
    wrap.style.backgroundColor = '#c8d6e5';
  }
});`, `/* запускаем приложение */
App.start();`,`
App.invertProperty('status', {
  roomId: '123',
  roomPass: '123'
});
`, `
App.changeNumericProperty('volume', -10, { 
  roomId: '123', 
  roomPass: '123' 
});
`,`
{
    "roomId": "123",
    "roomPass": "123",
    "params": {
        "status": true
    }
}
`,`
{ 
    "roomId": "123", 
    "roomPass": "123",
    "property": "status"
}
`,`
{ 
    "roomId": "123", 
    "roomPass": "123",
    "property": "volume",
    "value": -10
}
`,`
<div class="app-wrap"
     data-role="config">
`,`
<div class="app-wrap"
     data-role="config"
     data-theme="rgb(239, 239, 239)">
`, `// подписываемся на событие клика
btn.on('click', () => console.log('btn clicked!'));
`, `// подписываемся на событие клика
sw.on('click', val => console.log(val));

// посмотреть значение выключателя
console.log(sw.value);
`
    ]

    const R = '}';
    const L = '{';

    return (
      <div className="doc">
        <DocItem title="Введение" id="enter">
          <Image name="appex.png"/>
          <h5>Добро пожаловать в appex!</h5>
          Данная система умного дома ориентированна на создание отдельных приложений под каждую задачу,
          что позволяет добавлять и убирать различные устройства или
          сети устройств без потери функциональности и максимально удобно.
          <br/> <br/>
          Приложения работают вместе с устройствами в отдельных комнатах.
          В отличие от других решений, здесь приложения создаются на html/css/js.
          Для упрощения предусмотренны готовые пресеты.
          Подробнее о них будет написано далее.
          <br/> <br/>
          Для удобства приложения можно делить по группам. Это могут быть комнаты в квартире,
          разные дома или же просто разбиение по задачам. В каждую группу можно добавлять виджеты.
          Они показывают различные данные для группы - например температуру в комнате.

        </DocItem>
        <DocItem title="Комнаты" id="rooms">
          Для удобства взаимодействия приложение и устройства, управляемые им, обьединяются в одну комнату.
          <Image name="rooms.png"/>
          ID комнаты назначается системой, а имя и пароль можно поменять. ID и паролем комнаты можно делиться с другими пользователями, тогда они тоже смогут управлять Вашим устойством. Данные комнаты вводятся либо при созданнии приложения в меню редкатора кода, либо во вкладке 'настройки приложений' в настройках системы.
          <Image name="app_settings.png"/>
          Если не указать приложению данных комнаты или указать их с ошибкой, то в консоли браузера появится соответствующая ошибка.
        </DocItem>
        <DocItem title="Приложения" id="apps">
         Приложения и устройства общаются с сервером с помощью технологии websockets. Данные передаются в формате json. Парсить его на C++ не слишком удобно, но это необходимо для обеспесения всей функциональности. Внутри приложения связь с сервером происходит через вшитый в систему экземпляр класса App, на arduino или esp через библиотеки 'WebSocketsClient.h' и 'SocketIOclient.h' <br/><br/>
          В каждом приложении код хранится в 2-ух экземплярах: текущий и код последнего релиза. На эмуляторе открывается текущий код, а на устройствах пользователей код релиза. Это дает возможность разрабатывать обновления для приложений не ломая их.
        </DocItem>
        <DocItem title="Настройки" id="settings">
          В системе достаточно много всяких настроек. Это инструкция по некоторым из них.
          <Image name="settings.png"/>

          <h5>Настройки приложений</h5>
          <mark>id и пароль комнаты</mark> - комната, в которой работает приложение.
          <br/>
          <mark>группа</mark> - добавляет приложение в группу с указанным названием.
          <Image name="app_settings.png"/>

          <h5>Настройки виджетов</h5>
          <Image name="widget.png"/>
          Виджеты - удобный способ быстро узнать информацию о каком-нибудь показателе
          в комнате. Вот как они настраиваются: <br/> <br/>
          <mark>id и пароль комнаты</mark> - комната, в которой работает виджет.
          <br/>
          <mark>группа</mark> - добавляет виджет в группу с указанным названием.
          <br/>
          <mark>свойство</mark> - указывает, какое свойство объекта состояния показывать.
          В случае с приложением-выключателем, которое напишем далее, можно указать св-во
          status. Тогда виджет будет показывать статус выключателя.
          <br/>
          <mark>значок</mark> - значок из коллекции <a href="https://fontawesome.com/">fontawesome</a>.
          Указывается в camelCase. Например: faThermometerHalf.
          <br/>
          <mark>наименование</mark> - в чем измерять показания. Можно не указывать.
          <Image name="widget_settings.png"/>

          <h5>Настройки групп</h5>
          По умолчанию под названием группы написана фраза: "Пользовательская группа".
          Но её можно поменять: <br/><br/>
          <mark>имя группы</mark> - то, что указанно в пункте "группа" у виджетов и приложений.
          <br/>
          <mark>описание</mark> - описание группы вместо стандартного текста.
          <Image name="group_settings.png"/>

        </DocItem>
        <DocItem title="Класс App" id="class-app">
          Всё взаимодействие с сервером внутри приложения происходит внутри экземпляра этого класса. Но для его нормальной работы нужна настройка.
          <h5>1. Начальное состояние</h5>
          Для старта приложения необходимо указать ему все используемые параметры и их начальные состояния. Они используются для инициализации компонентов приложения и отсылаются на сервер при его старте. <mark>Все не указанные парамеры будут удалены из комнаты, внутри которой работает приложение.</mark>
          <Code>
            { codes[0] }
          </Code>
          <h5>2. Настройки</h5>
          Пока что есть только одна настройка: 'awaitResponse'. Показывает, ждать ли ответа с сервера перед обновлением состояния.
          <Code>
            { codes[1] }
          </Code>
          <h5>3. События</h5>
          У App есть 2 события: 'update' и 'err'. Подписавшись на них, Вы можете получать обновления состояния и сообщения об ошибках.
          <Code>
            { codes[2] }
          </Code>
          <Code>
            { codes[3] }
          </Code>
          Вмете с новыми параметрами в объекте state также будет присутствовать свойство 'lastChange', в котором находится время последнего изменения состояния в миллисекундах.
          <h5>4. Отправка состояния</h5>
          Для отправки нового состояния на сервер существует метод 'send'. В аргументах он принемает изменившиеся параметры. <mark>Крайне рекомендуется использовать обьект состояния без других вложенных обьектов.</mark> Это облегчит Вам парсинг json, а также улучшит работу алгоритма очистки мусора из комнат.
          <Code>
            { codes[4] }
          </Code>
          Отправлять данные можно <mark>не более 600 раз в минуту.</mark> При достижении порога до конца минуты при попытке послать параметры будет приходить ошибка 'TooManyRequests'.
          <h5>5. Запуск приложения</h5>
          Теперь можно запустить приложение.
          <Code>
            { codes[5] }
          </Code>
          В этот метод не передается никаких аргументов. Вызывайте его в самом конце кода.
        </DocItem>
        <DocItem title="Эмулятор" id="emulator">
          Для удобной разработки приложений в редакторе кода есть эмулятор. Он перезагружается после каждого сохранения. Логи работы приложения будут выводится в консоль браузера.
          <Image name="emulator.png"/>
          Эмулятор можно открыть в отдельном окне и переместить, например, на второй монитор. Также присутсвует возможность запускать последний код приложения на любом устройстве. <mark>Для этого следует перейти в настройки -> Об аккаунте -> Включить режим разработчика.</mark> В этом режиме Вы также будете видеть последние версии других приложений. Данная настройка сохраняется только для устройства, на котором была включена.
        </DocItem>
        <DocItem title="Пресеты" id="presets">
          Для более быстрой разработки приложения предусмотрены пресеты различных компонентов.
          Для их использования следует добавить в html верстку строку вида <mark>[[Preset param1="1" param2="2"]]</mark>.
          Все параметры обязательны к указанию. К пресетам можно обращаться из кода js по параметру <mark>name</mark>.
          Вот список существующих на данный момент пресетов:
          <h5>Кнопка</h5>
          Самая базовая кнопка из одного блока.
          <Code>
            { codes[6] }
          </Code>
          Javascript код:
          <Code>
            { codes[22] }
          </Code>
          <Image name="button.png"/>
          <h5>Выключатель</h5>
          Надстройка над чекбоксом.
          <Code>
            { codes[7] }
          </Code>
          Javascript код:
          <Code>
            { codes[23] }
          </Code>
          <Image name="switch.png"/>
          <h5>Иконки</h5>
          Иконки из набора fontawesome. Названия пишутся в camelCase.
          <Code>
            { codes[8] }
          </Code>
          <Image name="icon.png"/>
          В будущем количество пресетов будет увеличиваться.
        </DocItem>
        <DocItem title="Конфигурация приложения" id="app-config">
          Приложение конфигурируется в любом блоке его верстки.
          Чтобы обозначить блок как конфигурационный, нужно добавить в него
          атрибут <mark>data-role</mark>  со значением <mark>config</mark>.

          <Code>
            { codes[20] }
          </Code>

          <h5>Цвет статус бара</h5>
          Можно настроить подходящий цвет статус бара приложения под его фон.
          Для этого добавим в блок конфигурации атрибут <mark>data-theme</mark> с
          нужным цветом или значением <mark>auto</mark>, которое назначит цвет фона
          системы.

          <Code>
            { codes[21] }
          </Code>
        </DocItem>
        <DocItem title="Своё приложение" id="app-guide">
          Чтобы всё встало на свои места, разработаем с нуля стартовое приложение с выключателем.
          Сначала создадим приложение. Задаем название и иконку, включаем возможность клонирования.
          <Image name="create.png"/>
          Теперь добавим разметку приложения. По центру кнопки разместим иконку.
          <Code>
            { codes[9] }
          </Code>
          На эмуляторе пока ничего дельного не видно. Напишем стили для каждого элемента.
          <Code>
            { codes[10] }
          </Code>
          Теперь перед нами появилась кнопка. Сделаем для неё логику. Начальное состояние и настройки оставим прежними.
          <Code>
            { codes[11] }
          </Code>
          Найдем необходимые элементы. Повесим слушатель события 'click' на кнопку. При клике меняем состояние кнопки на противоположное, а также даем виброотклик в течение 40 миллисекунд.
          <Code>
            { codes[12] }
          </Code>
          Теперь подписываемся на событие 'update'. Во время обновления смотрим на новое состояние: если кнопка включена, то делаем её светлого сине-зеленого цвета, в противном случае красим в серый.
          <Code>
            { codes[13] }
          </Code>
          С написанием кода почти закончили. Осталось запустить приложение. Код целиком можно посмотреть в Ваших проектах, это приложение добавится туда при регистрации.
          <Code>
            { codes[14] }
          </Code>
          Подключаемся к комнате.
          <Image name="connect.png"/>
          Такая красота получилась. Теперь можно написать код для esp8266, например, прикрутить туда реле и управлять светом.
          <Image name="app.png"/>
        </DocItem>
        <DocItem title="Additional api" id="additional-api">
          Дополнительное api нужно для изменения состояния, когда Вам не известны значения свойств обьекта state
          в какой-либо комнате.
          <h5>invertProperty</h5>
          Данный метод инвертирует булевое свойство.
          <Code>
            { codes[15] }
          </Code>
          Если не передать обьект с логином и паролем комнаты, то запрос будет совершен в текущую комнату.
          <h5>changeNumericProperty</h5>
          Данный метод прибавляет переданное значение к числовому свойству. В примере ниже громкость уменьшается на 10.
          <Code>
            { codes[16] }
          </Code>
          Если не передать обьект с логином и паролем комнаты, то запрос будет совершен в текущую комнату.
        </DocItem>
        <DocItem title="Http core api" id="http-core-api">
          Http api может использоваться для голосовых ассистентов или иных случаев, когда не требуется постоянная
          связь с сервером. <mark>Запрос выполняется методом POST, параметры передаются в JSON.</mark>
          <h5>https://appex-system.ru/core_api/update_state</h5>
          <Code>
            { codes[17] }
          </Code>
          <h5>https://appex-system.ru/core_api/invert_property</h5>
          <Code>
            { codes[18] }
          </Code>
          <h5>https://appex-system.ru/core_api/change_numeric_property</h5>
          <Code>
            { codes[19] }
          </Code>
          <h5>https://appex-system.ru/core_api/get_property_value</h5>
          Возвращает значение свойства в JSON в "value".
          <Code>
            { codes[18] }
          </Code>
        </DocItem>
        <DocItem title="С++ код" id="C-plus-plus-code">
          Напишем код для esp8266. Плата будет реагировать на нажатие кнопки.
          <h5>Код длинный. Для удобства его можно <a href="./files/Relay.ino" download="" title="">скачать.</a></h5>
        </DocItem>
      </div>
    );

  }

  componentDidMount() {

    const buttonItems = document.querySelectorAll('.title-item');

    for (let buttonItem of buttonItems) {
      buttonItem.addEventListener('click', (event) => this.move());
    }

    this.move();
  }

  componentWillUnmount() {

  }

  move() {
    process.nextTick(() => {

      /* scroll to top */
      const id = window.location.hash.substring(1);
      if (!id) { return; }

      const wrap = document.querySelector('.doc');
      wrap.scroll(0, 0);

      /* set scroll size */
      const block = document.getElementById(id);
      const cords = block.getBoundingClientRect();
      const wrapTop = wrap.getBoundingClientRect().top;
      const scroll = cords.top - wrapTop;

      /* scroll to block */
      wrap.scroll(0, scroll);
    });
  }
}