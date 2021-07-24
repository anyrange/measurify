import User from "../../models/User.js";

export default async function(fastify) {
  fastify.post(
    "",
    {
      schema: {
        body: {
          type: "object",
          required: ["privacy", "customID", "autoUpdate"],
          properties: {
            privacy: {
              type: "string",
              pattern: "^(public)$|^(private)$|^(friendsOnly)$",
            },
            customID: {
              type: "string",
              maxLength: 16,
              minLength: 3,
              pattern:
                "^(?!.*(?:overview|listening-history|about|profile|top-listeners|account|track))[a-z0-9_-]{3,16}$",
            },
            autoUpdate: {
              type: "boolean",
            },
          },
        },
        response: {
          XXX: {
            type: "object",
            required: ["message", "status"],
            properties: {
              message: { type: "string" },
              status: {
                type: "number",
              },
            },
          },
        },
        tags: ["user settings"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const { privacy, customID, autoUpdate } = req.body;

      const user = await User.findOne({ customID }, { _id: 1 });

      if (user && user._id != _id)
        throw new this.CustomError("This id is already taken", 403);

      const updateResult = await User.updateOne(
        { _id },
        { privacy, customID, autoUpdate }
      );

      if (updateResult.n === 0)
        throw new this.CustomError("User not found", 404);

      if (updateResult.nModified === 0)
        throw new this.CustomError("Nothing to update", 400);

      reply.send({ message: "Successfully updated", status: 200 });
    }
  );
}
