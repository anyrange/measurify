import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: { type: String },
  display_name: { type: String, required: true },
  avatar: { type: String },
  country: { type: String, default: "US" },
  listened: {
    count: { type: Number, default: 0 },
    time: { type: Number, default: 0 },
  },
  listeningHistory: [
    {
      _id: false,
      track: { type: String, ref: "Track" },
      played_at: { type: Date },
    },
  ],
  settings: {
    username: { type: String, unique: true, required: true },
    privacy: { type: String, default: "public", required: true },
  },
  genresTimeline: [
    {
      _id: false,
      genres: [{ type: String }],
      date: { type: Date, default: Date.now },
    },
  ],
  tokens: {
    refreshToken: { type: String, required: true },
    token: { type: String, required: true },
  },
  followers: [{ type: String, ref: "User" }],
  follows: [{ type: String, ref: "User" }],
  lastLogin: { type: Date, default: Date.now },
  registrationDate: { type: Date, default: Date.now },
});

export default model("User", schema);
