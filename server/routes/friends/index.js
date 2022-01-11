export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["status", "friends"],
            properties: {
              status: { type: "number" },
              friends: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    avatar: { type: "string" },
                    display_name: { type: "string" },
                    lastLogin: { type: "string", format: "datetime" },
                    lastTrack: { $ref: "track#" },
                    lastPlayed: { string: "string", format: "datetime" },
                  },
                },
              },
            },
          },
        },
        tags: ["friends"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      const friends = await fastify.userFriends(_id);
      if (!friends.length) return reply.send({ status: 204, friends: [] });

      reply.send({ friends });
    }
  );
}
