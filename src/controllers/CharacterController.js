const User = require('../models/user');
const Character = require('../models/character');

const hello = (req, res) => {
  return res.send({ message: 'hello world!' });
};

const getCharacterById = (req, res) => {
  Character.findOne({ _id: req.params.id, owner: req.user.id })
    .then((character) => {
      if (character) {
        return res.status(200).send(character);
      } else {
        return res.status(404).send({ message: 'Character not found.' });
      }
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
};

const getCharactersByName = (req, res) => {
  Character.find({ name: req.params.name, owner: req.user.id })
    .then((characters) => {
      if (characters) {
        return res.status(200).send(characters);
      } else {
        return res.status(404).send({ message: 'Character not found.' });
      }
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
};

const getAllCharacters = (req, res) => {
  Character.find({ owner: req.user.id })
    .then((characters) => {
      if (characters) {
        return res.status(200).send(characters);
      } else {
        return res.status(404).send({ message: 'No characters found.' });
      }
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
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
  return res.status(200).send(character);
};

const deleteCharacter = (req, res) => {
  Character.findByIdAndRemove({ _id: req.params.id, owner: req.user.id })
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
  console.log(charInfo);
  Character.findByIdAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    charInfo,
    { new: true }
  )
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
  getCharacterById,
  getCharactersByName,
  getAllCharacters,
  createCharacter,
  deleteCharacter,
  editCharacter,
};

module.exports = CharacterController;
