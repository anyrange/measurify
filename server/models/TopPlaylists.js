const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
    required: true,
  },
  playtime: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
});

module.exports = model("TopPlaylists", schema);
