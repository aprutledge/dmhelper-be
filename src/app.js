require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const UserRoutes = require('./routes/UserRoute');
const CharacterRoutes = require('./routes/CharacterRoute');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    const corsOptions = {
      origin: ['http://localhost:8081'],
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
    this.server.use(CharacterRoutes);
  }
}

module.exports = new App().server;
