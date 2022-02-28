import mongoose from "mongoose";
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    _id: { type: String },
    name: { type: String },
    audioFeatures: {
      tempo: { type: Number },
      energy: { type: Number },
      loudness: { type: Number },
      danceability: { type: Number },
      instrumentalness: { type: Number },
      acousticness: { type: Number },
      speechiness: { type: Number },
      popularity: { type: Number },
      liveness: { type: Number },
      valence: { type: Number },
    },
    release_date: { type: String },
    total_tracks: { type: Number },
    genres: { type: [String] },
    label: { type: String },
    images: {
      highQuality: { type: String, default: "" },
      mediumQuality: { type: String, default: "" },
      lowQuality: { type: String, default: "" },
    },
  },
  { timestamps: { updatedAt: "updated_at" } }
);

export default model("Album", schema);
