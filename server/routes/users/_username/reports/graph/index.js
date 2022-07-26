export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },
        querystring: {
          type: "object",
          properties: {
            firstDate: { type: "string", format: "date" },
            lastDate: { type: "string", format: "date" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              required: ["date", "duration", "plays"],
              properties: {
                date: { type: "string", format: "date" },
                duration: { type: "number" },
                plays: { type: "number" },
              },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.userInfo;
      const { firstDate, lastDate } = req.query;

      const options = { _id: user._id, firstDate, lastDate };

      const graph = await userGraph(options);

      return reply.send(graph);
    }
  );

  const userGraph = async (opts) => {
    const agg = getAgg(opts);
    const graph = await fastify.db.User.aggregate(agg);
    return fillEmptyDates(graph, opts.lastDate);
  };
}

const fillEmptyDates = (plays, lastDate) => {
  if (!plays || !plays.length) return [];
  let graph = [];
  const firstDate = plays[plays.length - 1]._id;
  const date = new Date();
  let day = lastDate || date.toISOString().split("T")[0];

  while (day >= firstDate) {
    const play = plays.find((play) => play._id === day);

    if (play) {
      graph.push({
        date: play._id,
        plays: play.plays,
        duration: Math.round(play.playtime / 60 / 1000),
      });
    } else {
      graph.push({ date: day, plays: 0, duration: 0 });
    }

    day = new Date(day);
    day.setDate(day.getDate() - 1);
    day = day.toISOString().split("T")[0];
  }

  return graph;
};

const getAgg = ({ _id, firstDate, lastDate }) => {
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
      $project: {
        listeningHistory: {
          track: 1,
          played_at: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$listeningHistory.played_at",
            },
          },
        },
      },
    },
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
        _id: "$listeningHistory.played_at",
        plays: { $sum: 1 },
        playtime: { $sum: { $first: "$tracks.duration_ms" } },
      },
    },
    { $sort: { _id: -1 } }
  );
  return agg;
};
