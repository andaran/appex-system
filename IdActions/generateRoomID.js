
/*   ---==== Generate room id function ====---   */

const { uid } = require('rand-token');
const path = require('path');

const Room = require(path.join(__dirname, '../', 'models', 'room.js'));

const generateRoomId = () => {
  return new Promise((resolve, reject) => {
    async function gen() {

      /* generate id */
      const id = uid(12);

      /* check this id */
      Room.find({ id }).then(foundUsers => {
        foundUsers.length === 0
          ? resolve(id)
          : gen();
      }, err => reject(err));
    }

    /* start generation */
    gen();
  });
}

module.exports = generateRoomId;