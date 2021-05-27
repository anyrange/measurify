/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

export default async function(fastify) {
  const top = fastify.getSchema("top");

  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            range: {
              type: "number",
              minimum: 1,
              maximum: 50,
            },
            firstDate: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
            lastDate: {
              type: "string",
              pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            },
          },
        },
        response: { 200: top },
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError)
          return reply.code(417).send({ message: "Invalid parameters" });

        const token = req.cookies.token;
        if (!token) return reply.code(401).send({ message: "Unauthorized" });

        const _id = await fastify.auth(token);
        const range = req.query.range || 20;
        const firstDate = req.query.firstDate || "0000-00-00";
        let lastDate = req.query.lastDate || "9999-12-30";

        const document = await User.findOne(
          { _id },
          {
            recentlyPlayed: { $slice: ["$recentlyPlayed", 1] },
            lastSpotifyToken: 1,
          }
        );

        if (!document)
          return reply.code(404).send({ message: "User not found" });

        if (!document.recentlyPlayed || !document.recentlyPlayed.length)
          return reply.code(204).send({});

        if (lastDate) {
          lastDate = new Date(lastDate);
          lastDate.setDate(lastDate.getDate() + 1);
          lastDate = lastDate.toISOString().split("T")[0];
        }
        if (new Date(firstDate) > new Date())
          return reply.code(417).send({ message: "Invalid parameters" });

        const response = await fastify.parseTop(
          _id,
          document.lastSpotifyToken,
          range,
          firstDate,
          lastDate
        );

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
