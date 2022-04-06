import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const artists = async ({
  _id,
  range = 10,
  page = 1,
  firstDate,
  lastDate,
}) => {
  if (!_id) return { artists: [], pages: 1 };

  const agg = [
    { $match: { _id } },
    { $project: { listeningHistory: 1 } },
    { $unwind: { path: "$listeningHistory" } },
  ];

  if (firstDate)
    agg.push({
      $match: { "listeningHistory.played_at": { $gte: new Date(firstDate) } },
    });

  if (lastDate)
    agg.push({
      $match: { "listeningHistory.played_at": { $lte: new Date(lastDate) } },
    });

  agg.push(
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
        _id: null,
        artists: {
          $push: { id: "$id", name: "$name", image: "$image", plays: "$plays" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        count: { $ceil: { $divide: ["$count", range] } },
        artists: { $slice: ["$artists", (page - 1) * range, range] },
      },
    }
  );

  const [res] = await User.aggregate(agg);

  return { artists: res?.artists || [], pages: res?.count || 1 };
};

export default fp(async (fastify) =>
  fastify.decorate("userTopArtists", artists)
);
