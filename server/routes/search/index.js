import { addImage, formatTrack } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          required: ["search"],
          properties: {
            search: { type: "string", minLength: 1 },
            limit: { type: "number", minimum: 3, default: 10 },
            page: { type: "number", minimum: 1, default: 1 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              albums: { $ref: "albums#" },
              artists: { $ref: "entities#" },
              tracks: { $ref: "tracks#" },
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    display_name: { type: "string" },
                    avatar: { type: "string" },
                  },
                },
              },
            },
          },
        },
        tags: ["other"],
      },
    },
    async function (req, reply) {
      const { search, limit, page } = req.query;

      const id = await fastify.getId(req);
      const [token, country] = await Promise.all([
        fastify.getRandomToken(),
        fastify.getCountry(id),
      ]);

      const query = new RegExp(
        `.*${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}.*`
      );

      const [res, users] = await Promise.all([
        fastify.spotifyAPI({
          route: `search?q=${search}&type=track,artist,album&market=${country}&limit=${limit}&offset=${
            (page - 1) * limit
          }`,
          token,
        }),
        fastify.db.User.find(
          {
            "settings.username": { $regex: query, $options: "i" },
            "settings.privacy": "public",
          },
          { username: "$settings.username", display_name: 1, avatar: 1 }
        ).lean(),
      ]);

      return reply.send({
        albums: res.albums.items.map(addImage),
        artists: res.artists.items.map(addImage),
        tracks: res.tracks.items.map(formatTrack),
        users,
      });
    }
  );
}
