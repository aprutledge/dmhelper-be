require('../auth/auth');
const passport = require('passport');

const SecureRoute = (app) => {
  app.get(
    '/user/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
      res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token,
      });
    }
  );
};

module.exports = SecureRoute;
