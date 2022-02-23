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
    },
    async function (req, reply) {
      const _id = req.session.get("id");

      const user = await fastify.db.User.findById(_id, "tokens.token country");

      const currentPlayer = await fastify
        .spotifyAPI({
          route: `me/player/currently-playing?market=${user.country}`,
          token: user.tokens.token,
        })
        .catch(() => reply.code(204).send());

      if (!currentPlayer.item) return reply.code(204).send();

      reply.send(
        Object.assign(currentPlayer.item, {
          image: currentPlayer.item.album.images[1].url || "",
        })
      );
    }
  );
}
