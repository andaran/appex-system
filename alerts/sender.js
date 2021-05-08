
/* modules */
const readline = require('readline');
const path = require('path');
const mongoose = require('mongoose');

/* alerts */
const start = require(path.join(__dirname, '../', 'alerts', 'code', 'start.js'));
const main = require(path.join(__dirname, '../', 'alerts', 'code', 'main.js'));

/* models */
const User = require(path.join(__dirname, '../', 'models', 'user.js'));

mongoose.connect('mongodb://127.0.0.1/appex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) { console.log(err); }
});

/* alerts */
const alerts = {
  start, main,
}



/*   ---==== Alerts sender ====---   */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* change alert */
rl.question('[Qst] Выберите тип сообщения: ', (name) => {

  /* if no alert */
  if (!alerts[name]) {
    rl.write('[Err] Такого сообщения не найдено! \n');
    rl.close();
    return;
  }
  const alert = alerts[name];

  /* change send mode */
  rl.question('[Qst] Послать сообщение всем пользователям (Д/Н) ? ', (answer) => {

    /* send to all users */
    answer = answer.toLowerCase();
    if (answer === 'д' || answer === 'y') {

      rl.write('[Log] Отправка ...\n');

      /* update users */
      User.updateMany({}, { $addToSet: { alerts: [alert] } })
        .then(rez => rl.write('[Suc] Успешно! \n'))
        .catch(err => rl.write('[Err] Ошибка! \n', err))
        .finally(() => rl.close());

    /* send to any users */
    } else {

      /* usernames */
      rl.question('[Qst] Перечислите юзернеймы пользователей: ', (users) => {
        const usernames = users.split(',');

        if (usernames.length === 0) {
          rl.write('[Err] Вы не ввели ни одного пользователя! \n');
          rl.close();
          return;
        }

        rl.write('[Log] Отправка ...\n');

        /* update users */
        User.updateMany(
          { username: { $in: usernames }},
          { $addToSet: { alerts: [alert] } }
        )
          .then(rez => rl.write('[Suc] Успешно! \n', rez))
          .catch(err => rl.write('[Err] Ошибка! \n', err))
          .finally(() => rl.close());
      });
    }
  });
});