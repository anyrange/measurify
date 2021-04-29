const authMiddleware = (req, res, next) => {
  const _id = req.get("Authorization");

  if (!_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  next();
};

module.exports = authMiddleware;
