import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: { type: String },
  display_name: { type: String, required: true },
  avatar: { type: String },
  country: { type: String, default: "US" },
  listeningHistory: [
    {
      _id: false,
      track: { type: String, ref: "Track" },
      played_at: { type: Date },
    },
  ],
  settings: {
    username: { type: String, unique: true, required: true },
    autoUpdate: { type: Boolean, default: false, required: true },
    privacy: { type: String, default: "public", required: true },
  },
  tokens: {
    refreshToken: { type: String, required: true },
    token: { type: String, required: true },
  },
  friends: [{ type: String, ref: "User" }],
  lastLogin: { type: Date, default: Date.now },
  registrationDate: { type: Date, default: Date.now },
});

export default model("User", schema);
