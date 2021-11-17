const User = require('../models/user');

const hello = (req, res) => {
  return res.send({ message: 'hello world!' });
};

const createUser = async (req, res) => {
  console.log(req.body);
  const user = await User.create({
    email: req.body.email,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  res.send(user);
};

const HelloController = {
  hello,
  createUser,
};

module.exports = HelloController;
