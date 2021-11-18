require('../auth/auth');
const passport = require('passport');
const Util = require('../middleware/util');
const CharacterController = require('../controllers/CharacterController');

const SecureRoute = (app) => {
  app.post(
    '/character/add',
    passport.authenticate('jwt', { session: false }),
    CharacterController.createCharacter
  );

  app.patch(
    '/character/edit',
    passport.authenticate('jwt', { session: false }),
    Util.convertIdToObjectId,
    CharacterController.editCharacter
  );

  app.delete(
    '/character/delete',
    passport.authenticate('jwt', { session: false }),
    Util.convertIdToObjectId,
    CharacterController.deleteCharacter
  );
};

module.exports = SecureRoute;
