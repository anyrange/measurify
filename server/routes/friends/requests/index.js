export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        summary: "check all requests",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                send_at: { type: "string", format: "datetime" },
                display_name: { type: "string" },
                username: { type: "string" },
                privacy: { type: "string" },
                avatar: { type: "string" },
              },
            },
          },
        },
        tags: ["friends"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");

      const requests = await fastify.db.FriendRequest.find({
        to: id,
      })
        .populate(
          "from",
          "settings.username settings.privacy avatar display_name"
        )
        .lean();

      reply.send(
        requests.map(({ from, _id }) => ({
          send_at: _id.getTimestamp(),
          username: from.settings.username,
          privacy: from.settings.privacy,
          avatar: from.avatar,
          display_name: from.display_name,
        }))
      );
    }
  );
}
