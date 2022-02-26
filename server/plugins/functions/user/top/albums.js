import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const albums = ({ _id, range, page = 1 }) => {
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
        from: "albums",
        localField: "tracks.album",
        foreignField: "_id",
        as: "albums",
      },
    },
    {
      $addFields: {
        id: { $first: "$albums._id" },
        name: { $first: "$albums.name" },
        image: { $first: "$albums.images.mediumQuality" },
      },
    },
    {
      $group: {
        _id: { id: "$id", name: "$name", image: "$image" },
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
        albums: {
          $push: { id: "$id", name: "$name", image: "$image", plays: "$plays" },
        },
        items: { $sum: 1 },
      },
    },
    {
      $project: {
        items: 1,
        albums: { $slice: ["$albums", (page - 1) * range, range] },
      },
    },
  ];

  return User.aggregate(agg);
};

export default fp(async (fastify) => fastify.decorate("userTopAlbums", albums));
