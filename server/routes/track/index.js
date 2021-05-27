/**
 * @param {import('fastify').FastifyInstance} fastify
 */

import User from "../../models/User.js";
import fetch from "node-fetch";
import formatOverview from "../../includes/format-overview.js";
import plays from "../../includes/played-overview.js";

export default async function(fastify) {
  const overview = fastify.getSchema("overview");

  const responseSchema = {
    200: {
      type: "object",
      required: ["overview", "status"],
      properties: {
        track: {
          type: "object",
          required: [
            "name",
            "image",
            "popularity",
            "release_date",
            "duration_ms",
            "link",
            "album",
            "artists",
            "preview_url",
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
            duration_ms: {
              type: "number",
            },
            preview_url: {
              type: "string",
            },
            link: {
              type: "string",
            },
            artists: {
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
            album: {
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
        if (req.validationError)
          return reply
            .code(404)
            .send({ message: "Invalid track", status: 404 });

        const token = req.cookies.token;
        if (!token)
          return reply.code(401).send({ message: "Unauthorized", status: 401 });

        const _id = await fastify.auth(token);
        const trackID = req.params.id;

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });

        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        const track = await fetch(
          `https://api.spotify.com/v1/tracks/${trackID}`,
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

        if (track.error)
          return reply.code(track.error.status || 500).send({
            message: track.error.message,
            status: track.error.status || 500,
          });

        const playsRaw = await plays(_id, trackID);

        if (!playsRaw.length)
          return reply.code(200).send({ status: 204, overview: [] });

        const response = {
          track: {
            album: {
              name: track.album.name,
              id: track.album.id,
            },
            artists: track.artists.map(({ name, id }) => {
              return { name, id };
            }),
            name: track.name,
            preview_url: track.preview_url,
            popularity: track.popularity,
            image: track.album.images.length ? track.album.images[0].url : "",
            link: track.external_urls.spotify,
            duration_ms: track.duration_ms,
            release_date: track.album.release_date,
          },
          overview: formatOverview(playsRaw),
          status: 200,
        };

        reply.code(200).send(response);
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 200 });
        console.log(e);
      }
    }
  );
}
