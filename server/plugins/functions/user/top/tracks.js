import fp from "fastify-plugin";
import User from "#server/models/User.js";

export const tracks = ({
  _id,
  firstDate,
  lastDate,
  range,
  page = 1,
  search,
}) => {
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
    {
      $lookup: {
        from: "tracks",
        localField: "_id",
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
    }
  );

  if (search) {
    const query = new RegExp(
      `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
      "i"
    );
    agg.push({ $match: { "tracks.name": { $regex: query } } });
  }

  agg.push(
    { $sort: { plays: -1 } },
    {
      $group: {
        _id: "",
        tracks: {
          $push: {
            id: "$_id",
            name: { $first: "$tracks.name" },
            album: { $first: "$albums" },
            artists: "$artists",
            image: { $first: "$tracks.image" },
            duration_ms: { $first: "$tracks.duration_ms" },
            plays: "$plays",
          },
        },
        items: { $sum: 1 },
      },
    },
    {
      $project: {
        items: 1,
        tracks: { $slice: ["$tracks", (page - 1) * range, range] },
      },
    },
    { $sort: { name: 1 } }
  );
  return User.aggregate(agg);
};

export default fp(async (fastify) => fastify.decorate("userTopTracks", tracks));
