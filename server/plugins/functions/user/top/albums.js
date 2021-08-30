import fp from "fastify-plugin";
import User from "../../../../models/User.js";

export const albums = ({
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
        image: { $first: "$albums.image" },
      },
    }
  );

  if (search) {
    const query = new RegExp(
      `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`,
      "i"
    );
    agg.push({ $match: { name: { $regex: query } } });
  }

  agg.push(
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
    }
  );
  return User.aggregate(agg);
};

export default fp(async (fastify) => fastify.decorate("userTopAlbums", albums));
