import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const artists = ({ _id, range, page = 1 }) => {
  const agg = [
    { $match: { _id } },
    { $project: { listeningHistory: 1 } },
    { $unwind: { path: "$listeningHistory" } },

    {
      $lookup: {
        from: "tracks",
        localField: "listeningHistory.track",
        foreignField: "_id",
        as: "tracks",
      },
    },
    {
      $lookup: {
        from: "artists",
        localField: "tracks.artists",
        foreignField: "_id",
        as: "artists",
      },
    },
    { $unwind: { path: "$artists" } },
    {
      $group: {
        _id: {
          id: "$artists._id",
          name: "$artists.name",
          image: "$artists.images.mediumQuality",
        },
        plays: { $sum: 1 },
      },
    },
    {
      $addFields: {
        id: "$_id.id",
        name: "$_id.name",
        image: "$_id.image",
      },
    },
    { $sort: { plays: -1, name: 1 } },
    {
      $group: {
        _id: "",
        artists: {
          $push: { id: "$id", name: "$name", image: "$image", plays: "$plays" },
        },
        items: { $sum: 1 },
      },
    },
    {
      $project: {
        items: 1,
        artists: { $slice: ["$artists", (page - 1) * range, range] },
      },
    },
  ];

  return User.aggregate(agg);
};

export default fp(async (fastify) =>
  fastify.decorate("userTopArtists", artists)
);
