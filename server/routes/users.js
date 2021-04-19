const User = require("../models/User");
const users = async (req, res) => {
  try {
    const usersQuantity = await User.estimatedDocumentCount();
    res.status(200).json({ usersQuantity });
  } catch (e) {
    res.status(404).json();
    console.log(e);
  }
};
module.exports = users;
