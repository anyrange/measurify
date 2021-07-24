import User from "../../../models/User.js";
export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["items", "status"],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "string",
                  minLength: 22,
                  maxLength: 22,
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["smart-playlist"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const { subscriptions } = await User.findOne(
        { _id },
        { "subscriptions.smartPlaylist.playlists": 1 }
      );

      if (!subscriptions?.smartPlaylist?.playlists.length)
        return reply.send({ items: [], status: 204 });

      reply.send({ items: subscriptions.smartPlaylist.playlists });
    }
  );
}
