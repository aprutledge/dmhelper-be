require('../auth/auth');
const passport = require('passport');
const Util = require('../middleware/util');
const CharacterController = require('../controllers/CharacterController');

const CharacterRoute = (app) => {
  app.get(
    '/character',
    passport.authenticate('jwt', { session: false }),
    CharacterController.getAllCharacters
  );

  app.get(
    '/character/:name',
    passport.authenticate('jwt', { session: false }),
    CharacterController.getCharactersByName
  );

  app.get(
    '/character/:id',
    passport.authenticate('jwt', { session: false }),
    CharacterController.getCharacterById
  );

  app.post(
    '/character/add',
    passport.authenticate('jwt', { session: false }),
    CharacterController.createCharacter
  );

  app.patch(
    '/character/edit/:id',
    passport.authenticate('jwt', { session: false }),
    Util.convertIdToObjectId,
    CharacterController.editCharacter
  );

  app.delete(
    '/character/delete/:id',
    passport.authenticate('jwt', { session: false }),
    Util.convertIdToObjectId,
    CharacterController.deleteCharacter
  );
};

module.exports = CharacterRoute;
