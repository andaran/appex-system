
/*   ---==== Send mails ====---   */

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

/* options for .hbs engine */

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'layouts'),
    defaultLayout : 'default.hbs',
  },
  viewPath: path.join(__dirname, 'layouts'),
  extName: '.hbs'
};

/* send letter function */
const mailer = (to, subject, template, context) => {
  return new Promise((resolve, reject) => {

    /* transporter settings */
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      auth: {
        user: 'appex.system@yandex.ru',
        pass: 'Ojyn*2IHjsnH',
      },
    });

    /* apply handlebars settings */
    transporter.use('compile', hbs(options));

    /* send the mail */
    transporter.sendMail({
      from: '"Appex system" <appex.system@yandex.ru>',
      to, subject, template, context,
    })
      .then(info => resolve(info))
      .catch(err => reject(err));
  });
}

module.exports = mailer;
