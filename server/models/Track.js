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
  duration_ms: { type: Number },
  image: { type: String, default: "" },
  album: { type: String, ref: "Album" },
  artists: [{ type: String, ref: "Artist" }],
});

export default model("Track", schema);
