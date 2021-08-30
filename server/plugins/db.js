import fp from "fastify-plugin";
import User from "../models/User.js";
import Artist from "../models/Artist.js";
import Album from "../models/Album.js";
import Track from "../models/Track.js";
import Playlist from "../models/Playlist.js";
import mongoose from "mongoose";

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) return console.log(`Database connection error: ${err.message}`);
    console.info(`Database successfully connected`);
  }
);

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("db", { User, Artist, Album, Track, Playlist });
});

export default plugin;
