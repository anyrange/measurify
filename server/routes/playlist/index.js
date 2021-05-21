/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import fetch from "node-fetch";
import formatOverview from "../../includes/format-overview.js";
import history from "../../includes/listening-history.js";
import plays from "../../includes/played-overview.js";

export default async function(fastify) {
  const auth = fastify.getSchema("auth");
  const overview = fastify.getSchema("overview");
  const tracks = fastify.getSchema("tracks");

  const responseSchema = {
    200: {
      type: "object",
      required: ["playlist", "overview", "tracks"],
      properties: {
        playlist: {
          type: "object",
          required: [
            "name",
            "image",
            "collaborative",
            "link",
            "followers",
            "owner",
            "public",
            "tracks",
          ],
          properties: {
            name: {
              type: "string",
            },
            image: {
              type: "string",
            },
            collaborative: {
              type: "boolean",
            },
            followers: {
              type: "number",
            },
            link: {
              type: "string",
            },
            public: {
              type: "boolean",
            },
            tracks: {
              type: "number",
            },
            owner: {
              type: "object",
              required: ["name", "id"],
              properties: {
                name: { type: "string" },
                id: { type: "string" },
              },
            },
          },
        },
        overview,
        tracks,
      },
    },
  };

  fastify.get(
    "/:id",
    {
      schema: {
        headers: auth,
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              minLength: 22,
              maxLength: 22,
            },
          },
        },
        response: responseSchema,
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (
          req.validationError &&
          req.validationError.validationContext === "headers"
        )
          return reply.code(401).send({ message: "Unauthorized" });

        if (
          req.validationError &&
          req.validationError.validationContext === "params"
        )
          return reply.code(404).send({ message: "Invalid playlist" });

        const _id = req.headers.authorization;

        const playlistID = req.params.id;

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user) return reply.code(404).send({ message: "User not found" });

        const playlist = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistID}?fields=collaborative, external_urls, followers(total),images,name,owner(display_name,id),public,tracks(total)`,
          {
            headers: {
              Authorization: "Bearer " + user.lastSpotifyToken,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            throw err;
          });

        if (playlist.error)
          return reply.code(playlist.error.status || 500).send({
            message: playlist.error.message,
          });

        const [overviewRaw, tracks] = await Promise.all([
          plays(_id, playlistID),
          history(_id, playlistID),
        ]);

        const response = {
          playlist: {
            name: playlist.name,
            image: playlist.images.length ? playlist.images[0].url : "",
            collaborative: playlist.collaborative,
            link: playlist.external_urls.spotify,
            followers: playlist.followers.total,
            owner: { name: playlist.owner.display_name, id: playlist.owner.id },
            public: playlist.public,
            tracks: playlist.tracks.total,
          },
          overview: formatOverview(overviewRaw),
          tracks,
        };

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
