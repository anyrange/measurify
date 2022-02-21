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
  image: {
    type: String,
    default: function () {
      return this.images[1] || this.images[0] || "";
    },
  },
  images: {
    highQuality: { type: String, default: "" },
    lowQuality: { type: String, default: "" },
  },
});

export default model("Album", schema);
