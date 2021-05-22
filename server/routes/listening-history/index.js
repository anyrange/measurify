/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */

import User from "../../models/User.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;

export default async function(fastify) {
  const auth = fastify.getSchema("auth");
  const history = fastify.getSchema("listening-history");
  const schema = {
    headers: auth,
    querystring: {
      type: "object",
      properties: {
        page: {
          type: "number",
          minimum: 1,
        },
        range: {
          type: "number",
          minimum: 1,
        },
      },
    },
    response: {
      200: history,
    },
  };

  fastify.get(
    "/",
    {
      schema,
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError) {
          const errorSource = req.validationError.validationContext;

          errorSource === "headers" &&
            reply.code(401).send({ message: "Unauthorized" });

          errorSource === "querystring" &&
            reply.code(417).send({ message: "Invalid parameters" });

          return;
        }

        const _id = req.headers.authorization;

        const range = req.query.range || 50;
        const page = req.query.page - 1 || 0;
        const agg = [
          {
            $match: {
              _id: new ObjectId(_id),
            },
          },
          {
            $project: {
              _id: 0,
              "recentlyPlayed.album.id": 1,
              "recentlyPlayed.album.name": 1,
              "recentlyPlayed.artists.id": 1,
              "recentlyPlayed.artists.name": 1,
              "recentlyPlayed.duration_ms": 1,
              "recentlyPlayed.id": 1,
              "recentlyPlayed.name": 1,
              "recentlyPlayed.played_at": 1,
            },
          },
          {
            $project: {
              tracksLength: {
                $size: "$recentlyPlayed",
              },
              recentlyPlayed: {
                $slice: ["$recentlyPlayed", page * range, range],
              },
            },
          },
        ];

        const user = await User.aggregate(agg);

        if (!user[0])
          return reply.code(404).send({ message: "User not found" });

        if (!user[0].tracksLength) return reply.code(204).send({});

        reply.code(200).send({
          pages: Math.ceil(user[0].tracksLength / range),
          history: user[0].recentlyPlayed,
        });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
