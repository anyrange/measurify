const authMiddleware = (req, res, next) => {
  const _id = req.get("Authorization");
  if (typeof _id !== "string") {
    res.status(401).json({ message: `Unauthorized` });
    return;
  }
  next();
};

module.exports = authMiddleware;
