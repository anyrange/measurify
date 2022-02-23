import fp from "fastify-plugin";
import User from "#server/models/User.js";
import Artist from "#server/models/Artist.js";
import Album from "#server/models/Album.js";
import Track from "#server/models/Track.js";
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
  fastify.decorate("db", {
    User,
    Artist,
    Album,
    Track,
  });
});

export default plugin;
