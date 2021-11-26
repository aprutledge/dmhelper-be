require('../auth/auth');
const passport = require('passport');
const { Router } = require('express');
const Util = require('../middleware/util');
const CharacterController = require('../controllers/CharacterController');

const CharacterRoutes = Router();

CharacterRoutes.get(
  '/character',
  passport.authenticate('jwt', { session: false }),
  CharacterController.getAllCharacters
);

CharacterRoutes.get(
  '/character/:name',
  passport.authenticate('jwt', { session: false }),
  CharacterController.getCharactersByName
);

CharacterRoutes.get(
  '/character/:id',
  passport.authenticate('jwt', { session: false }),
  CharacterController.getCharacterById
);

CharacterRoutes.post(
  '/character/add',
  passport.authenticate('jwt', { session: false }),
  CharacterController.createCharacter
);

CharacterRoutes.patch(
  '/character/edit/:id',
  passport.authenticate('jwt', { session: false }),
  Util.convertIdToObjectId,
  CharacterController.editCharacter
);

CharacterRoutes.delete(
  '/character/delete/:id',
  passport.authenticate('jwt', { session: false }),
  Util.convertIdToObjectId,
  CharacterController.deleteCharacter
);

module.exports = CharacterRoutes;
