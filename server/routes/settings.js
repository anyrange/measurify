const User = require("../models/User");
const settings = {
  get: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const user = await User.findOne(
        { _id },
        { private: 1, customID: 1, spotifyID: 1 }
      );
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
      res.status(404).json();
    }
  },
  set: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const confidential = req.body.private;
      const customID = req.body.customID;

      const updateResult = await User.updateOne(
        { _id },
        { private: confidential, customID }
      );

      if (updateResult.nModified !== 1) {
        return res.status(406).json({ message: "Нахуй пошёл" });
      }

      res.status(200).json({ message: "success" });
    } catch (e) {
      console.log(e);
      res.status(406).json({ message: "Нахуй пошёл" });
    }
  },
};
module.exports = settings;
