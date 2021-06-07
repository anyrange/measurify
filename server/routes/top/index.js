/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";

export default async function(fastify) {
  const top = fastify.getSchema("top");
  const headers = fastify.getSchema("cookie");

  fastify.get(
    "",
    {
      schema: {
        headers,
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
        response: {
          200: {
            type: "object",
            required: ["top", "status"],
            properties: {
              status: {
                type: "number",
              },
              top,
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req.cookies.token);
      const range = req.query.range || 20;
      const firstDate = req.query.firstDate;
      let lastDate = req.query.lastDate;

      const document = await User.findOne(
        { _id },
        {
          recentlyPlayed: { $slice: ["$recentlyPlayed", 1] },
          lastSpotifyToken: 1,
        }
      );

      if (!document)
        return reply.code(404).send({ message: "User not found", status: 404 });

      if (!document.recentlyPlayed || !document.recentlyPlayed.length)
        return reply.code(200).send({
          status: 204,
          top: { tracks: [], albums: [], artists: [], playlists: [] },
        });

      if (lastDate) {
        lastDate = new Date(lastDate);
        lastDate.setDate(lastDate.getDate() + 1);
        lastDate = lastDate.toISOString().split("T")[0];
      }

      if (new Date(firstDate) > new Date())
        return reply
          .code(406)
          .send({ message: "Invalid parameters", status: 406 });

      const response = await fastify.parseTop(
        _id,
        document.lastSpotifyToken,
        range,
        firstDate,
        lastDate
      );

      reply.code(200).send({ top: response, status: 200 });
    }
  );
}
