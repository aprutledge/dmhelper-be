const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user');

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      process.nextTick(() => {
        UserModel.findOne({ email }, (err, user) => {
          if (err) return done(err);

          if (user) {
            return done(null, false, { message: 'User already exists' });
          } else {
            var newUser = new UserModel();
            newUser.email = email;
            newUser.password = password;
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.save((err) => {
              if (err) throw err;

              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      const userId = token.user._id;
      UserModel.findById(userId)
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, null);
        });
    }
  )
);
