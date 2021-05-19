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
      required: ["album", "overview", "tracks"],
      properties: {
        album: {
          type: "object",
          required: [
            "name",
            "image",
            "popularity",
            "release_date",
            "total_tracks",
            "link",
            "genres",
            "artists",
          ],
          properties: {
            name: {
              type: "string",
            },
            image: {
              type: "string",
            },
            popularity: {
              type: "number",
            },
            release_date: {
              type: "string",
            },
            total_tracks: {
              type: "number",
            },
            link: {
              type: "string",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
            artist: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "id"],
                properties: {
                  name: { type: "string" },
                  id: { type: "string" },
                },
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
          return reply.code(404).send({ message: "Invalid album" });

        const _id = req.headers.authorization;

        const albumID = req.params.id;

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user) return reply.code(404).send("User not found");

        const album = await fetch(
          `https://api.spotify.com/v1/albums/${albumID}`,
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

        if (album.error)
          return reply.code(album.error.status || 500).send({
            message: album.error.message,
          });

        const info = await Promise.all([
          plays(_id, albumID),
          history(_id, albumID),
        ]);

        const response = {
          album: {
            name: album.name,
            image: album.images.length ? album.images[0].url : "",
            popularity: album.popularity,
            release_date: album.release_date,
            total_tracks: album.total_tracks,
            link: album.external_urls.spotify,
            genres: album.genres,
            artists: album.artists.map(({ name, id }) => {
              return { name, id };
            }),
          },
          overview: formatOverview(info[0]),
          tracks: info[1],
        };

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!" });
        console.log(e);
      }
    }
  );
}
