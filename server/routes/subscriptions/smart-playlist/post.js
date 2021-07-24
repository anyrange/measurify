import User from "../../../models/User.js";
import fetch from "node-fetch";
import images from "../../../assets/images.js";

import { parsePlaylists } from "../../../includes/cron-workers/smart-playlist.js";

export default async function(fastify) {
  fastify.post(
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
              message: { type: "string" },
              status: { type: "number" },
            },
          },
        },
        tags: ["smart-playlist"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const user = await User.findOne(
        { _id },
        { spotifyID: 1, lastSpotifyToken: 1 }
      );

      if (!user) throw new this.CustomError("User not found", 404);

      const createdPlaylist = await fetch(
        `https://api.spotify.com/v1/users/${user.spotifyID}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
          },
          body: JSON.stringify({
            name: "Smart Playlist",
            description: "Created by Spotiworm",
            public: true,
          }),
        }
      ).then((res) => res.json());

      if (createdPlaylist.error) throw new this.CustomError("Error", 400);

      await fetch(
        `https://api.spotify.com/v1/playlists/${createdPlaylist.id}/images`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + user.lastSpotifyToken,
            "Content-Type": "image/jpeg",
          },
          body: images[0],
        }
      );

      const opResult = await User.updateOne(
        { _id },
        {
          "subscriptions.smartPlaylist.playlists": req.body.items,
          "subscriptions.smartPlaylist.id": createdPlaylist.id,
        }
      );

      if (opResult.nModified === 0) throw new this.CustomError("Error", 400);

      await parsePlaylists({
        _id,
        lastSpotifyToken: user.lastSpotifyToken,
        playlists: req.body.items,
        id: createdPlaylist.id,
      });

      reply.code(201).send({ message: "Succesfully subscribed", status: 201 });
    }
  );
}
