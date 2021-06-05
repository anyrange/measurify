import User from "../../../models/User.js";
import fetch from "node-fetch";

export default async function(fastify) {
  const headers = fastify.getSchema("cookie");
  fastify.post(
    "/",
    {
      schema: {
        headers,
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
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);

        const user = await User.findOne(
          { _id },
          { spotifyID: 1, lastSpotifyToken: 1 }
        );

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        const createdPlaylist = await fetch(
          `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + user.lastSpotifyToken,
            },
            body: JSON.stringify({
              name: "Smart as fuck boiiii",
              description: "Created by Spotiworm",
              public: false,
            }),
          }
        ).then((res) => res.json());

        if (createdPlaylist.error)
          return reply.code(400).send({ message: "Error", status: 400 });

        const opResult = await User.updateOne(
          { _id },
          {
            "subscriptions.smartPlaylist.playlists": req.body.items,
            "subscriptions.smartPlaylist.id": createdPlaylist.id,
          }
        );

        if (opResult.nModified === 0)
          return reply.code(400).send({ message: "Error", status: 400 });

        return reply
          .code(201)
          .send({ message: "Succesfully subscribed", status: 201 });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
