import fp from "fastify-plugin";

export default fp(async (fastify) =>
  fastify.decorate("userOverview", async ({ _id, firstDate, lastDate }) => {
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
        $group: {
          _id: "",
          plays: { $sum: 1 },
          playtime: { $sum: { $first: "$tracks.duration_ms" } },
        },
      }
    );

    const [overview] = await fastify.db.User.aggregate(agg);
    return overview
      ? {
          plays: overview.plays,
          playtime: Math.round(overview.playtime / 60 / 1000),
        }
      : { plays: 0, playtime: 0 };
  })
);
