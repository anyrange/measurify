const User = require("../models/User");
const users = (req, res) => {
  User.count((err, usersQuantity) => {
    if (err) {
      res.status(408).json({ message: err.toString() });
      return;
    }
    res.status(200).json({ usersQuantity });
  });
};
module.exports = users;
