const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttributesSchema = new Schema({
  str: {
    type: Number,
    required: true,
  },
  dex: {
    type: Number,
    required: true,
  },
  con: {
    type: Number,
    required: true,
  },
  wis: {
    type: Number,
    required: true,
  },
  int: {
    type: Number,
    required: true,
  },
  cha: {
    type: Number,
    required: true,
  },
});

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
