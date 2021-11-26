const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    collection: 'places',
    versionKey: false,
  }
);

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
