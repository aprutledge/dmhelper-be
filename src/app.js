require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;

Promise.resolve(app)
  .then(MongoDBConnection())
  .catch((err) =>
    console.error.bind(
      console.error,
      `MongoDB connection error: ${JSON.stringify(err)}`
    )
  );

async function MongoDBConnection() {
  await mongoose.connect(mongoURI).then(() => {
    console.log(`| MongoDB URL  : ${mongoURI}`);
    console.log('| MongoDB Connected');
    console.log('|-----------------------------------------');
  });

  return null;
}

const corsOptions = {
  origin: ['http://localhost:8081'],
};

app.use(cors(corsOptions));

app.set('etag', false);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(passport.initialize());
require('./routes/UserRoute')(app);
require('./routes/CharacterRoute')(app);

module.exports = app;
