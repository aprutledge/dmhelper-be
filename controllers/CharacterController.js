const User = require('../models/user');
const Character = require('../models/character');

const hello = (req, res) => {
  return res.send({ message: 'hello world!' });
};

const createCharacter = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  console.log(user);
  const character = await Character.create({
    name: req.body.name,
    race: req.body.race,
    charClass: req.body.charClass,
    attributes: {
      str: req.body.attributes.str,
      dex: req.body.attributes.dex,
      con: req.body.attributes.con,
      wis: req.body.attributes.wis,
      int: req.body.attributes.int,
      cha: req.body.attributes.cha,
    },
    owner: user.id,
  });
  return res.send(character);
};

const deleteCharacter = (req, res) => {
  Character.findByIdAndRemove({ _id: req.body.id })
    .then((result) => {
      if (result) {
        return res
          .status(200)
          .send({ result, message: 'Character deleted successfully.' });
      } else {
        return res.status(404).send({ message: 'Character not found.' });
      }
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
};

const editCharacter = (req, res) => {
  const { id, ...charInfo } = req.body;
  console.log(charInfo);
  Character.findByIdAndUpdate({ _id: id }, charInfo, { new: true })
    .then((result) => {
      if (result) {
        return res
          .status(200)
          .send({ result, message: 'Character updated successfully.' });
      } else {
        return res.status(404).send({ message: 'Character not found.' });
      }
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
};

const CharacterController = {
  hello,
  createCharacter,
  deleteCharacter,
  editCharacter,
};

module.exports = CharacterController;
