const User = require("../models/User");
const settings = {
  get: async (req, res) => {
    try {
      const _id = req.get("Authorization");
      const user = await User.findOne(
        { _id },
        { private: 1, customID: 1, spotifyID: 1 }
      );

      let result = {
        spotifyID: user.spotifyID,
        customID: user.customID,
        private: user.private,
      };

      return res.status(200).send(result);
    } catch (e) {
      console.log(e);
      return res.status(404).send({ message: "An error occured" });
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
        return res
          .status(406)
          .send({ message: "Фn error occurred while updating" });
      }

      res.status(200).send({ message: "Successfully updated" });
    } catch (e) {
      console.log(e);
      res.status(406).send({ message: "An error occured" });
    }
  },
};
module.exports = settings;
