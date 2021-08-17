import User from "../../models/User.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["overview", "status"],
            properties: {
              status: { type: "number" },
              overview: {
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
          },
        },
        tags: ["dashboard"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const { _id } = req;

      const plays = await User.aggregate()
        .match({ _id: new ObjectId(_id) })
        .project({
          recentlyPlayed: { "plays.played_at": 1, duration_ms: 1 },
        })
        .unwind("recentlyPlayed")
        .unwind("recentlyPlayed.plays")
        .addFields({
          "recentlyPlayed.played_at": {
            $toDate: "$recentlyPlayed.plays.played_at",
          },
        })
        .project({
          recentlyPlayed: {
            duration_ms: 1,
            played_at: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$recentlyPlayed.played_at",
              },
            },
          },
        })
        .group({
          _id: { date: "$recentlyPlayed.played_at" },
          plays: { $sum: 1 },
          playtime: { $sum: "$recentlyPlayed.duration_ms" },
        })
        .project({
          date: "$_id.date",
          plays: 1,
          duration: { $round: { $divide: ["$playtime", 60000] } },
          _id: 0,
        })
        .sort("-date");

      if (!plays || !plays.length)
        return reply.send({ status: 204, overview: [] });

      reply.send({ overview: fillEmptyDates(plays) });
    }
  );
}

const fillEmptyDates = (plays) => {
  if (!plays || !plays.length) return [];
  let overview = [];
  const firstDate = plays[plays.length - 1].date;
  const date = new Date();
  let day = date.toISOString().split("T")[0];

  while (day >= firstDate) {
    const play = plays.find((play) => play.date === day);

    if (play) {
      overview.push(play);
    } else {
      overview.push({ date: day, plays: 0, duration: 0 });
    }

    day = new Date(day);
    day.setDate(day.getDate() - 1);
    day = day.toISOString().split("T")[0];
  }

  return overview;
};
