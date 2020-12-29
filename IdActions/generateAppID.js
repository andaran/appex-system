
/*   ---==== Generate application id function ====---   */

const { uid } = require('rand-token');
const path = require('path');

const App = require(path.join(__dirname, '../', 'models', 'app.js'));

const generateAppId = () => {
  return new Promise((resolve, reject) => {
    async function gen() {

      /* generate id */
      const id = uid(12);

      /* check this id */
      App.find({ id }).then(foundApps => {
        foundApps.length === 0
          ? resolve(id)
          : gen();
      }, err => reject(err));
    }

    /* start generation */
    gen();
  });
}

module.exports = generateAppId;