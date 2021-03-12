const { Schema, model } = require("mongoose");

const schema = new Schema({
  spotifyToken: {
    type: String,
    required: true,
  },
  // spotifyID: {
  //   type: String,
  //   required: true,
  // },
  playlists: {
    type: Array,
    default: [],
  },
});

module.exports = model("User", schema);
