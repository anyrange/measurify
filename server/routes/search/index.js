import addImage from "#server/utils/addImage.js";

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
              status: { type: "number" },
            },
          },
        },
        tags: ["other"],
      },
      preValidation: [fastify.auth],
    },
    async function (req, reply) {
      const id = req.session.get("id");
      const { search, limit, page } = req.query;

      const user = await fastify.db.User.findById(
        id,
        "tokens.token country"
      ).lean();

      const res = await fastify.spotifyAPI({
        route: `search?q=${search}&type=track,artist,album&market=${
          user.country
        }&limit=${limit}&offset=${(page - 1) * limit}`,
        token: user.tokens.token,
      });

      reply.send({
        albums: res.albums.items.map(addImage),
        artists: res.artists.items.map(addImage),
        tracks: res.tracks.items.map((track) =>
          Object.assign(track, {
            image: track.album.images.length ? track.album.images[0].url : "",
          })
        ),
      });
    }
  );
}
