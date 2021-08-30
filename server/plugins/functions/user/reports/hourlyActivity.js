import fp from "fastify-plugin";

export default fp(async (fastify) =>
  fastify.decorate(
    "userHourlyActivity",
    async ({ _id, firstDate, lastDate }) => {
      const agg = [
        { $match: { _id } },
        { $project: { listeningHistory: 1 } },
        { $unwind: { path: "$listeningHistory" } },
      ];

      if (firstDate)
        agg.push({
          $match: {
            "listeningHistory.played_at": { $gte: new Date(firstDate) },
          },
        });

      if (lastDate)
        agg.push({
          $match: {
            "listeningHistory.played_at": { $lte: new Date(lastDate) },
          },
        });

      agg.push(
        {
          $project: {
            _id: "$listeningHistory.track",
            time: {
              $dateToString: {
                format: "%H",
                date: "$listeningHistory.played_at",
              },
            },
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
          $group: {
            _id: "$time",
            plays: { $sum: 1 },
            playtime: { $sum: { $first: "$tracks.duration_ms" } },
          },
        },
        {
          $project: {
            time: { $toInt: "$_id" },
            plays: 1,
            playtime: { $round: [{ $divide: ["$playtime", 60000] }, 0] },
          },
        },
        { $sort: { time: -1 } }
      );

      const activity = await fastify.db.User.aggregate(agg);

      const hourlyActivity = [];
      for (let i = 1; i <= 24; i++) {
        hourlyActivity.push(
          activity.find((hour) => hour.time === i) || {
            time: i,
            playtime: 0,
            plays: 0,
          }
        );
      }

      return hourlyActivity;
    }
  )
);
