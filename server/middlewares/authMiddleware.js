const authMiddleware = (req, res, next) => {
  const _id = req.get("Authorization");
  console.log(_id);
  if (!_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  console.log("a");
  next();
};

module.exports = authMiddleware;
