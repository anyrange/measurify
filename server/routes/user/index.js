/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import fetch from "node-fetch";
import mongodb from "mongodb";
const { ObjectId } = mongodb;

export default async function(fastify) {
  const auth = fastify.getSchema("auth");
  const top = fastify.getSchema("top");
  const history = fastify.getSchema("listening-history");

  const responseSchema = {
    200: {
      type: "object",
      required: [
        "userName",
        "avatar",
        "lastLogin",
        "overview",
        "history",
        "top",
      ],
      properties: {
        userName: {
          type: "string",
        },
        avatar: {
          type: "string",
        },
        lastlogin: {
          type: "string",
        },
        overview: {
          type: "object",
          required: ["plays", "playtime"],
          properties: {
            plays: {
              type: "number",
            },
            playtime: {
              type: "number",
            },
          },
        },
        history,
        top,
      },
    },
  };

  fastify.get(
    "/:id",
    {
      schema: {
        headers: auth,
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: responseSchema,
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (
          req.validationError &&
          req.validationError.validationContext === "headers"
        )
          return reply.code(401).send({ message: "Unauthorized" });

        if (
          req.validationError &&
          req.validationError.validationContext === "params"
        )
          return reply.code(404).send({ message: "Invalid user" });

        const _id = req.headers.authorization;

        const requestor = await User.findOne({ _id }, { _id: 1 });

        if (!requestor) return reply.code(401).send("Unauthorized");

        const customID = req.params.id;

        const user = await User.findOne(
          { customID },
          { userName: 1, private: 1, avatar: 1, lastLogin: 1 }
        );

        if (!user) return reply.code(404).send("User not found");

        if (user.private && _id != user._id)
          return reply.code(403).send({ message: "Private profile" });

        const response = {
          userName: user.userName,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
        };

        const agg = [
          {
            $match: {
              _id: ObjectId(user._id),
            },
          },
          {
            $project: {
              "recentlyPlayed.duration_ms": 1,
              _id: 0,
            },
          },
          {
            $unwind: {
              path: "$recentlyPlayed",
            },
          },
          {
            $group: {
              _id: {},
              plays: {
                $sum: 1,
              },
              playtime: {
                $sum: "$recentlyPlayed.duration_ms",
              },
            },
          },
        ];

        const requests = [
          fetch(req.protocol + "://" + req.headers.host + "/top?range=5", {
            headers: {
              Authorization: user._id,
            },
          })
            .then((res) => res.json())
            .then((body) => {
              response.top = body;
            }),
          fetch(
            req.protocol +
              "://" +
              req.headers.host +
              "/listening-history?range=20",
            {
              headers: {
                Authorization: user._id,
              },
            }
          )
            .then((res) => res.json())
            .then((body) => {
              response.history = body;
            }),
          User.aggregate(agg).then((body) => {
            response.overview = {
              plays: body[0].plays,
              playtime: Math.round(body[0].playtime / 1000 / 60),
            };
          }),
        ];

        await Promise.all(requests);

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
