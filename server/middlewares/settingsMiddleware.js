const User = require("../models/User");
const settingsMiddleware = async (req, res, next) => {
  // const confidential = req.body.private;
  const customID = req.body.customID;

  if (!customID) return res.status(403).send({ message: "Nothing to update" });

  // if (await User.findOne({ customID }))
  //   return res.status(403).send({ message: "This id is already taken" });

  next();
};
module.exports = settingsMiddleware;
