require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const express = require('express');
const winston = require('winston'),
  expressWinston = require('express-winston');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');

require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./auth/authenticate');

const UserRoutes = require('./routes/UserRoute');
//const CharacterRoutes = require('./routes/CharacterRoute');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.server.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
        meta: false,
        msg: 'HTTP {{req.method}} {{req.url}}',
        expressFormat: true,
        colorize: false,
      })
    );
    this.server.use(express.json());
    this.server.use(cookieParser(process.env.COOKIE_SECRET));
    this.server.use(express.urlencoded({ extended: true }));
    const corsOptions = {
      origin: 'http://localhost:3000',
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    };
    this.server.use(cors(corsOptions));
    this.server.set('etag', false);
    this.server.use((req, res, next) => {
      res.set('Cache-Control', 'no-store');
      next();
    });
    this.server.use(passport.initialize());
  }

  async database() {
    await mongoose.connect(mongoURI).then(() => {
      console.log(`| MongoDB URL  : ${mongoURI}`);
      console.log('| MongoDB Connected');
      console.log('|-----------------------------------------');
    });
  }

  routes() {
    this.server.use(UserRoutes);
    //this.server.use(CharacterRoutes);
  }
}

module.exports = new App().server;
