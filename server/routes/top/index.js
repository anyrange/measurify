import User from "../../models/User.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            range: { type: "number", minimum: 1, maximum: 50 },
            firstDate: { type: "string", format: "date" },
            lastDate: { type: "string", format: "date" },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["top", "status"],
            properties: {
              status: { type: "number" },
              top: { $ref: "top" },
            },
          },
        },
        tags: ["dashboard"],
      },
    },
    async function (req, reply) {
      const { _id } = req;
      const range = req.query.range || 20;
      const firstDate = req.query.firstDate;
      let lastDate = req.query.lastDate;

      const document = await User.findOne(
        { _id },
        {
          recentlyPlayed: { $slice: ["$recentlyPlayed", 1] },
          lastSpotifyToken: 1,
        }
      ).lean();

      if (!document) throw new this.CustomError("User not found", 404);

      if (!document.recentlyPlayed || !document.recentlyPlayed.length)
        return reply.send({
          status: 204,
          top: { tracks: [], albums: [], artists: [], playlists: [] },
        });

      if (lastDate) {
        lastDate = new Date(lastDate);
        lastDate.setDate(lastDate.getDate() + 1);
        lastDate = lastDate.toISOString().split("T")[0];
      }

      if (new Date(firstDate) > new Date())
        throw new this.CustomError("Invalid parameters", 406);

      const response = await fastify.parseTop(
        _id,
        document.lastSpotifyToken,
        range,
        firstDate,
        lastDate
      );

      reply.send({ top: response });
    }
  );
}
