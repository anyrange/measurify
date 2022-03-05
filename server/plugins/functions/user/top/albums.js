import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const albums = async ({ _id, range = 10, page = 1 }) => {
  if (!_id) return { albums: [], pages: 1 };

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
        id: { $first: "$tracks.album" },
        name: { $first: "$albums.name" },
        image: { $first: "$albums.images.mediumQuality" },
      },
    },
    {
      $group: {
        _id: {
          id: "$id",
          name: "$name",
          image: "$image",
          album: { $first: "$tracks.album" },
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
        _id: null,
        albums: { $push: "$$ROOT" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        count: { $ceil: { $divide: ["$count", range] } },
        albums: { $slice: ["$albums", (page - 1) * range, range] },
      },
    },
  ];
  const [res] = await User.aggregate(agg);

  return { albums: res?.albums || [], pages: res?.count || 1 };
};

export default fp(async (fastify) => fastify.decorate("userTopAlbums", albums));
