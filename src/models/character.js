const mongoose = require('mongoose');
const { Schema } = mongoose;
const AttributesSchema = require('./attributes').AttributesSchema;

const CharacterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    race: {
      type: String,
      required: true,
    },
    charClass: {
      type: String,
      required: true,
    },
    attributes: AttributesSchema,
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    collection: 'characters',
    versionKey: false,
  }
);

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
