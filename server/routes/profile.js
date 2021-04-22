const User = require("../models/User");
const profile = {
  get: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const user = await User.findOne({ _id }, { private: 1 });
      res.status(200).json({ private: user.private });
    } catch (e) {
      console.log(e);
      res.status(404).json();
    }
  },
  post: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const private = req.body.private;
      await User.updateOne({ _id }, { private });
      res.status(200).json("success");
    } catch (e) {
      console.log(e);
      res.status(404).json();
    }
  },
};
module.exports = profile;
