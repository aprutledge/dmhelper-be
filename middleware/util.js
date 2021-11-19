const mongoose = require('mongoose');

const convertIdToObjectId = (req, res, next) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    var objectId = mongoose.Types.ObjectId(req.params.id);
    req.body.id = objectId;
  }
  next();
};

const Util = {
  convertIdToObjectId,
};

module.exports = Util;
