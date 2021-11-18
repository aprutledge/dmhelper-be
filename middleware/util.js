const mongoose = require('mongoose');

const convertIdToObjectId = (req, res, next) => {
  if (mongoose.isValidObjectId(req.body.id)) {
    var objectId = mongoose.Types.ObjectId(req.body.id);
    req.body.id = objectId;
  }
  next();
};

const Util = {
  convertIdToObjectId,
};

module.exports = Util;
