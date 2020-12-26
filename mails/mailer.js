
/*   ---==== Send mails ====---   */

const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

/* send letter function */
const mailer = (to, subject, layout, context) => {
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

    /* generate template */
    const code = fs.readFileSync(path.join(__dirname, 'layouts', layout));
    const template = handlebars.compile(code);
    const html = template(context);

    /* send the mail */
    transporter.sendMail({
      from: '"Appex system" <appex.system@yandex.ru>',
      to, subject, html,
    })
      .then(info => resolve(info))
      .catch(err => reject(err));
  });
}

module.exports = mailer;
