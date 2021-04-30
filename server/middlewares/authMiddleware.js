const authMiddleware = (req, res, next) => {
  const _id = req.get("Authorization");
  if (!_id) {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  if (_id.length !== 24) {
    res.status(404).json({ message: `Invalid` });
    return;
  }
  next();
};

module.exports = authMiddleware;
