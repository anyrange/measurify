import fp from "fastify-plugin";
import User from "../../../../models/User.js";

export const playlists = ({
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
    { $match: { "listeningHistory.context": { $ne: null } } },
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
        _id: "$listeningHistory.context",
        plays: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "_id",
        as: "playlists",
      },
    }
  );

  if (search) {
    const query = new RegExp(
      `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
      "i"
    );
    agg.push({ $match: { "playlists.name": { $regex: query } } });
  }

  agg.push(
    {
      $addFields: {
        id: "$_id",
        name: { $first: "$playlists.name" },
        image: { $first: "$playlists.image" },
      },
    },
    { $sort: { plays: -1, name: 1 } },
    {
      $group: {
        _id: "",
        playlists: {
          $push: { id: "$id", name: "$name", image: "$image", plays: "$plays" },
        },
        items: { $sum: 1 },
      },
    },
    {
      $project: {
        items: 1,
        playlists: { $slice: ["$playlists", (page - 1) * range, range] },
      },
    }
  );
  return User.aggregate(agg);
};

export default fp(async (fastify) =>
  fastify.decorate("userTopPlaylists", playlists)
);
