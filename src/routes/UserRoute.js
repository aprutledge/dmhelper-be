require('dotenv').config();
const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require('../auth/authenticate');

const UserRoutes = Router();

UserRoutes.post('/signup', (req, res, next) => {
  //Verify that first name is not empty
  if (!req.body.firstName) {
    res.status(500).send({
      name: 'FirstNameError',
      message: 'The first name is required',
    });
  } else {
    UserModel.register(
      new UserModel({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName || '';
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err, user) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
              res.send({ success: true, token });
            }
          });
        }
      }
    );
  }
});

UserRoutes.post('/login', passport.authenticate('local'), (req, res, next) => {
  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  UserModel.findById(req.user._id).then((user) => {
    user.refreshToken.push({ refreshToken });
    user.save((err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      }
    });
  });
});

UserRoutes.post('/refreshToken', (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      User.findOne({ _id: userId }).then(
        (user) => {
          if (user) {
            //Find refresh token against user record
            const tokenIndex = user.refreshToken.findIndex(
              (item) => item.refreshToken === refreshToken
            );

            if (tokenIndex === -1) {
              res.status(401).send({ message: 'Unauthorized' });
            } else {
              const token = getToken({ _id: userId });
              // If refresh token exists, then create new one and replace
              const newRefreshToken = getRefreshToken({ _id: userId });
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
              user.save((err, user) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
                  res.send({ success: true, token });
                }
              });
            }
          } else {
            res.status(401).send({ message: 'Unauthorized' });
          }
        },
        (err) => next(err)
      );
    } catch (err) {
      res.status(401).send({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

UserRoutes.get('/profile', verifyUser, (req, res, next) => {
  res.send(req.user);
});

UserRoutes.post('/logout', verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User.findById(req.user._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.clearCookie('refreshToken', COOKIE_OPTIONS);
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});

module.exports = UserRoutes;
