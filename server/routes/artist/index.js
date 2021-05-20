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
      required: ["artist", "overview", "tracks"],
      properties: {
        artist: {
          type: "object",
          required: ["followers", "genres", "name", "image", "link"],
          properties: {
            followers: {
              type: "number",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
            name: { type: "string" },
            image: { type: "string" },
            link: { type: "string" },
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
          return reply.code(404).send({ message: "Invalid artist" });

        const _id = req.headers.authorization;

        const artistID = req.params.id;

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user) return reply.code(404).send({ message: "User not found" });

        const artist = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}`,
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

        if (artist.error)
          return reply.code(artist.error.status || 500).send({
            message: artist.error.message,
          });

        // get data for graph

        const [overviewRaw, tracks] = await Promise.all([
          plays(_id, artistID),
          history(_id, artistID),
        ]);

        // response schema
        const response = {
          artist: {
            followers: artist.followers.total,
            genres: artist.genres,
            name: artist.name,
            image: artist.images.length ? artist.images[0].url : "",
            link: artist.external_urls.spotify,
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
