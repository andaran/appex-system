
/*   ---==== Generate user id function ====---   */

const { uid } = require('rand-token');
const path = require('path');

const User = require(path.join(__dirname, '../', 'models', 'user.js'));

const generateUserId = () => {
  return new Promise((resolve, reject) => {
    async function gen() {

      /* generate id */
      const id = uid(12);

      /* check this id */
      User.find({ id }).then(foundUsers => {
        foundUsers.length === 0
          ? resolve(id)
          : gen();
      }, err => reject(err));
    }

    /* start generation */
    gen();
  });
}

module.exports = generateUserId;