import User from "../../../models/User.js";

export default async function(fastify) {
  fastify.delete(
    "",
    {
      schema: {
        body: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                minLength: 22,
                maxLength: 22,
              },
            },
          },
        },
        response: {
          XXX: {
            type: "object",
            required: ["message", "status"],
            properties: {
              message: {
                type: "string",
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
      const _id = await fastify.auth(req);
      const opResult = await User.updateOne(
        { _id },
        {
          $pull: {
            "subscriptions.smartPlaylist.playlists": { $in: req.body.items },
          },
        }
      );

      if (opResult.n === 0) throw new this.CustomError("Error", 400);

      if (opResult.nModified === 0)
        throw new this.CustomError("Nothing to delete", 400);

      reply.code(200).send({ message: "Succesfully updated", status: 200 });
    }
  );
}
