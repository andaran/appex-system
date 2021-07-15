# Appex system

<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/andaran/appex-system"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/andaran/appex-system"><img alt="GitHub" src="https://img.shields.io/github/license/andaran/appex-system">

## Описание:

Система умного дома с открытым исходным кодом для самодельных проектов. 
Для каждого устройства в системе создается приложение на html/css/js.
Для упрощения процесса разработки имеется встроенный шаблонизатор с готовыми
модулями. 

Взаимодействие устройств происходит по протоколу wss. Приложение и все устройства, относящиеся к этому
приложению помещаются в одну комнату. В этой комнате находится объект состояния, в котором указаны все 
необходимые данные о работе устройства. Про работу с ним можно почитать в документации. 
( https://www.appex-system.ru/doc#class-app, https://www.appex-system.ru/doc#C-plus-plus-code )

<strong> Плюсы и особенности: </strong>

1. Работает быстрее за счёт использования протокола wss по сравнению 
   с устройствами умного дома известного производителя.
2. Доступно 600 запросов на сервер в минуту - можно управлять роботами.
3. Любые устройства из разных групп могут взаимодействовать между собой, имеется удобное api для этого.
4. Кроме ws api есть также http api для привязывания умных устройств к другим сервисам, например голосовым
   ассистентам.
5. Можно удобно делиться своими приложениями и давать другим людям доступ к некоторым компонентам 
   своего умного дома.
6. Интерфейс для приложений делается самостоятельно. Это сложнее, но не приходится ограничиваться
   готовыми блоками, хотя они тоже есть. Также имеется возможность добавлять иконки fontawesome, 
   делать любые запросы в интернет. 
7. Можно подключать не только esp8266, но и малину, компьютер, и т.д. Главное, чтобы выход в интернет был. 
8. Всё бесплатно.


## Локальная установка:

<strong>!!! Перед локальной установкой следует установить nodejs, npm, mongodb.</strong>

1. Клонируем репозиторий (git clone https://github.com/andaran/appex-system)
2. Скачиваем необходимые пакеты. `npm i`
3. Создаем конфиг окружения. Прописываем туда пароли для сессий, базу данных и порт. `nano .env`
```
# .env
   
sessionSecretKey1=0u@Fq|nTyaHG
sessionSecretKey2=U99}G9zTsKDg
database=mongodb://127.0.0.1/appex
port=3001
```
4. Собираем приложение. `npm run build`
5. Запускаем! `node appex`
