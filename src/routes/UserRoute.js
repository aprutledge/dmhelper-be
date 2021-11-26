const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
require('../auth/auth');

const UserRoutes = Router();

UserRoutes.post('/signup', (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401);
      res.send({ message: info.message });
      return;
    }

    if (user) {
      res.json({
        message: 'Signup successful',
        user: user,
      });
    }
  })(req, res, next);
});

UserRoutes.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occured.');

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, 'TOP_SECRET');

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = UserRoutes;
