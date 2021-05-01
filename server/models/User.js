const { Schema, model } = require("mongoose");

const schema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  customID: {
    type: String,
    unique: true,
    required: true,
  },
  spotifyID: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  lastSpotifyToken: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  playlists: {
    type: Array,
    default: [],
  },
  recentlyPlayed: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
  },
  private: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = model("User", schema);
