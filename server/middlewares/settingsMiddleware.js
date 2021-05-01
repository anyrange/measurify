const User = require("../models/User");
const settingsMiddleware = async (req, res, next) => {
  const confidential = req.body.private;
  const customID = req.body.customID;

  if (!customID || !confidential)
    return res.status(403).json({ message: `Not enough data` });

  if (await User.findOne({ customID }))
    return res.status(403).json({ message: `This id is already taken` });

  next();
};
module.exports = settingsMiddleware;
