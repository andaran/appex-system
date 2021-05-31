# Appex system

Система умного дома с открытым исходным кодом.

## Локальная установка:

<strong><span style="color:orange">!!!</span> Перед локальной установкой следует установить nodejs, npm, mongodb.</strong>

1. Клонируем репозиторий (git clone https://github.com/andaran/appex-system)
2. Скачиваем необходимые пакеты. `npm i`
3. Создаем конфиг окружения. Прописываем туда пароли для сессий и порт. `> .env`
```
# .env
   
sessionSecretKey1=0u@Fq|nTyaHG
sessionSecretKey2=U99}G9zTsKDg
database=mongodb://127.0.0.1/appex
port=3001
```
4. Собираем приложение. `npm run build`
5. Запускаем! `node appex`
6. Для тестирования верстки можно запустить отдельный сервер. `npm run start`
