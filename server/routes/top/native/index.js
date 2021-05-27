import fetch from "node-fetch";
import User from "../../../models/User.js";

export default async function(fastify) {
  const response = {
    200: {
      type: "object",
      required: ["tracks", "artists", "status"],
      properties: {
        tracks: {
          type: "array",
          items: {
            type: "object",
            required: [
              "id",
              "name",
              "duration_ms",
              "popularity",
              // "url",
              "image",
              "album",
              "artists",
            ],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              duration_ms: { type: "number" },
              popularity: { type: "number" },
              // url: { type: "string" },
              image: { type: "string" },
              album: {
                type: "object",
                required: ["id", "name", "url"],
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  // url: { type: "string" },
                },
              },
              artists: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "name", "url"],
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    // url: { type: "string" },
                  },
                },
              },
            },
          },
        },
        artists: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "id", "image", "url", "genres", "popularity"],
            properties: {
              name: { type: "string" },
              id: { type: "string" },
              image: { type: "string" },
              url: { type: "string" },
              genres: { type: "array", items: { type: "string" } },
              popularity: { type: "number" },
            },
          },
        },
        status: {
          type: "number",
        },
      },
    },
  };

  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            range: {
              type: "number",
              minimum: 0,
            },
            period: {
              type: "string",
              pattern: "^(long_term|medium_term|short_term)$",
            },
          },
        },
        response,
      },
      attachValidation: true,
    },
    async function(req, reply) {
      try {
        if (req.validationError)
          return reply
            .code(406)
            .send({ message: "Invalid parameters", status: 406 });

        const token = req.cookies.token;
        if (!token)
          return reply.code(401).send({ message: "Unauthorized", status: 401 });

        const _id = await fastify.auth(token);
        const range = req.query.range || 20;
        const period = req.query.period || "long_term";

        const user = await User.findOne({ _id }, { lastSpotifyToken: 1 });
        if (!user)
          return reply
            .code(404)
            .send({ message: "User not found", status: 404 });

        const options = { token: user.lastSpotifyToken, range, period };
        const info = await Promise.all([tracks(options), artists(options)]);

        reply
          .code(200)
          .send({ tracks: info[0], artists: info[1], status: 200 });
      } catch (e) {
        reply.code(500).send({ message: "Something went wrong!", status: 500 });
        console.log(e);
      }
    }
  );
}

const tracks = async ({ token, period, range }) => {
  const tracks = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${range}&time_range=${period}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw e;
    });

  return tracks.items.map((track) => formatTrack(track));
};

const artists = async ({ token, period, range }) => {
  const artists = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${range}&time_range=${period}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw e;
    });

  return artists.items.map((artist) => {
    return {
      name: artist.name,
      id: artist.id,
      image: artist.images.length ? artist.images[0].url : "",
      url: artist.external_urls.spotify,
      followers: artist.total,
      genres: artist.genres,
      popularity: artist.popularity,
    };
  });
};

function formatTrack(track) {
  if (!track) return;

  const album = {
    id: track.album.id,
    name: track.album.name,
    url: track.album.external_urls.spotify,
  };

  const artists = track.artists.map(({ id, name, external_urls }) => {
    return { id, name, url: external_urls.spotify };
  });

  return {
    id: track.id,
    name: track.name,
    duration_ms: track.duration_ms,
    popularity: track.popularity,
    url: track.external_urls.spotify,
    image:
      track.album.images && track.album.images.length
        ? track.album.images[2].url
        : "",
    album,
    artists,
  };
}
