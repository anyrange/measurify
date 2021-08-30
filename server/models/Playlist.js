import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schema = new Schema({
  _id: { type: String },
  id: {
    type: String,
    default: function () {
      return this._id;
    },
  },
  name: { type: String },
  image: { type: String },
  owner: { id: { type: String, ref: "User" }, name: { type: String } },
});

export default model("Playlist", schema);
