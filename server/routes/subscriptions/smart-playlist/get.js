import User from "../../../models/User.js";
export default async function(fastify) {
  const headers = fastify.getSchema("cookie");
  fastify.get(
    "",
    {
      schema: {
        headers,
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
              status: {
                type: "number",
              },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req.cookies.token);

      const { subscriptions } = await User.findOne(
        { _id },
        { "subscriptions.smartPlaylist.playlists": 1 }
      );

      if (!subscriptions?.smartPlaylist?.playlists.length)
        return reply.code(200).send({ items: [], status: 204 });

      reply
        .code(200)
        .send({ items: subscriptions.smartPlaylist.playlists, status: 200 });
    }
  );
}
