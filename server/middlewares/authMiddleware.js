const authMiddleware = (req, res, next) => {
  const _id = req.get("Authorization");
  console.log(_id.split("2")[0]);
  if (!_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  next();
};

module.exports = authMiddleware;
