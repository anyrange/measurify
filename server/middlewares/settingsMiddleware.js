const User = require("../models/User");

const settingsMiddleware = async (req, res, next) => {
  const customID = req.body.customID;
  const privacy = req.body.private;
  const user_id = req.get("Authorization");

  if (!customID || typeof privacy == "undefined")
    return res.status(403).send({ message: "Nothing to update" });

  const resp = await User.findOne({ customID }, { _id: 1 });

  if (resp && resp._id != user_id)
    return res.status(403).send({ message: "This id is already taken" });

  next();
};

module.exports = settingsMiddleware;
