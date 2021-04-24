const health = (req, res) => {
  res.status(200).json({ message: "I'm alive" });
};
module.exports = health;
