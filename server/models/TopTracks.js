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
  plays: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  lastPlayed: {
    type: Date,
    default: Date.now(),
  },
  duration: {
    type: Number,
    required: true,
  },
  album: { type: Object, required: true },
  artists: { type: Array, required: true },
});

module.exports = model("TopTracks", schema);
