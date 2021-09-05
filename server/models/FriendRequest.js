import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schema = new Schema({
  from: { type: String, ref: "User" },
  to: { type: String, ref: "User" },
});

export default model("FriendRequests", schema);
