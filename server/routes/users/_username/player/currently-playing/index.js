export default async function (fastify) {
  fastify.addHook("onSend", async (req, reply) => {
    if (reply.statusCode === 200) reply.removeHeader("Cache-Control");
  });

  fastify.get(
    "",
    {
      schema: {
        params: {
          type: "object",
          required: ["username"],
          properties: { username: { type: "string" } },
        },
        response: {
          200: {
            type: "object",
            properties: {
              ...fastify.getSchema("track").properties,
              duration_ms: { type: "number" },
              played_at: { type: "string", format: "date" },
            },
          },
        },
        tags: ["user"],
      },
      preHandler: [fastify.getUserInfo],
    },
    async function (req, reply) {
      const user = req.user;

      if (user.leaved)
        return reply
          .code(403)
          .send({ message: `Currently not available for ${user.username}` });

      const currentPlayer = await fastify
        .spotifyAPI({
          route: `me/player/currently-playing?market=${user.country}`,
          token: user.token,
        })
        .catch(() => reply.code(204).send());

      if (!currentPlayer.item) return reply.code(204).send();

      const images = currentPlayer.item.album.images;

      reply.send({
        ...currentPlayer.item,
        image: images[1].url || images[0].url || "",
      });
    }
  );
}
