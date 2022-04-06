import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const tracks = async ({
  _id,
  range = 10,
  page = 1,
  firstDate,
  lastDate,
}) => {
  if (!_id) return { tracks: [], pages: 1 };

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
      $group: {
        _id: "$listeningHistory.track",
        plays: { $sum: 1 },
      },
    },
    { $sort: { plays: -1 } },
    {
      $group: {
        _id: "",
        listeningHistory: {
          $push: {
            plays: "$plays",
            track: "$_id",
          },
        },
      },
    },
    { $addFields: { count: { $size: "$listeningHistory" } } },
    { $unwind: { path: "$listeningHistory" } },
    { $skip: (page - 1) * range },
    { $limit: range },
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
      $lookup: {
        from: "artists",
        localField: "tracks.artists",
        foreignField: "_id",
        as: "artists",
      },
    },
    {
      $addFields: {
        id: { $first: "$tracks._id" },
        name: { $first: "$tracks.name" },
        image: { $first: "$tracks.images.lowQuality" },
        duration_ms: { $first: "$tracks.duration_ms" },
        plays: "$listeningHistory.plays",
        album: {
          id: { $first: "$albums._id" },
          name: { $first: "$albums.name" },
          image: { $first: "$albums.images.lowQuality" },
        },
        artists: {
          $map: {
            input: "$artists",
            as: "artist",
            in: {
              id: "$$artist._id",
              name: "$$artist.name",
              image: "$$artist.images.lowQuality",
            },
          },
        },
      },
    }
  );

  const tracks = await User.aggregate(agg);

  return {
    pages: Math.ceil((tracks[0]?.count || 0) / range) || 1,
    tracks,
  };
};

export default fp(async (fastify) => fastify.decorate("userTopTracks", tracks));
