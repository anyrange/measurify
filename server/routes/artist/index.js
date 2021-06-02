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
      required: ["artist", "overview", "tracks", "status"],
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
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError) {
          const { status, message } = fastify.validate(req.validationError);
          return reply.code(status).send({ message, status });
        }

        const _id = await fastify.auth(req.cookies.token);
        const artistID = req.params.id;

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        const artist = await fastify.spotifyAPI({
          route: `artists/${artistID}`,
          token: user.lastSpotifyToken,
        });

        if (artist.error)
          return reply.code(artist.error.status || 500).send({
            message: artist.error.message,
            status: artist.error.status || 500,
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
          status: 200,
        };

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}
