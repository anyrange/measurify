/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import formatOverview from "../../includes/format-overview.js";
import history from "../../includes/listening-history.js";
import plays from "../../includes/played-overview.js";

export default async function(fastify) {
  const overview = fastify.getSchema("overview");
  const tracks = fastify.getSchema("listening-history");
  const headers = fastify.getSchema("cookie");

  const responseSchema = {
    200: {
      type: "object",
      required: ["playlist", "overview", "tracks", "status"],
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
        status: {
          type: "number",
        },
      },
    },
  };

  fastify.get(
    "/:id",
    {
      schema: {
        headers,
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
    },
    async function(req, reply) {
      const _id = req.user_id;
      const playlistID = req.params.id;

      const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

      if (!user)
        return reply.code(404).send({ message: "User not found", status: 404 });

      const playlist = await fastify.spotifyAPI({
        route: `playlists/${playlistID}?fields=collaborative,external_urls,followers(total),images,name,owner(display_name,id),public,tracks(total)`,
        token: user.lastSpotifyToken,
      });

      if (playlist.error)
        return reply.code(playlist.error.status || 500).send({
          message: playlist.error.message,
          status: playlist.error.status || 500,
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
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
