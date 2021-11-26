const mongoose = require('mongoose');
const { Schema } = mongoose;
const AttributesSchema = require('./attributes').AttributesSchema;

const NPCSchema = new Schema(
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
    collection: 'npcs',
    versionKey: false,
  }
);

const NPC = mongoose.model('NPC', NPCSchema);

module.exports = NPC;
