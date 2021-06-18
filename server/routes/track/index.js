import User from "../../models/User.js";

export default async function(fastify) {
  const headers = fastify.getSchema("cookie");

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
            "danceability",
            "energy",
            "key",
            "loudness",
            "mode",
            "speechiness",
            "acousticness",
            "instrumentalness",
            "liveness",
            "valence",
            "tempo",
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
            danceability: {
              type: "number",
            },
            energy: {
              type: "number",
            },
            key: {
              type: "number",
            },
            loudness: {
              type: "number",
            },
            mode: {
              type: "number",
            },
            speechiness: {
              type: "number",
            },
            acousticness: {
              type: "number",
            },
            instrumentalness: {
              type: "number",
            },
            liveness: {
              type: "number",
            },
            valence: {
              type: "number",
            },
            tempo: {
              type: "number",
            },
            artists: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "id", "image"],
                properties: {
                  name: { type: "string" },
                  id: { type: "string" },
                  image: { type: "string" },
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
        overview: {
          type: "object",
          required: ["plays", "playtime"],
          properties: {
            plays: { type: "number" },
            playtime: { type: "number" },
          },
        },
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
      const trackID = req.params.id;

      const user = await User.findOne(
        { _id, "recentlyPlayed.id": trackID },
        {
          lastSpotifyToken: 1,
          "recentlyPlayed.$": 1,
        }
      );

      if (!user) throw new this.CustomError("Not found", 404);

      const [track, audioFeatures] = await Promise.all([
        fastify.spotifyAPI({
          route: `tracks/${trackID}`,
          token: user.lastSpotifyToken,
        }),
        fastify.spotifyAPI({
          route: `audio-features/${trackID}`,
          token: user.lastSpotifyToken,
        }),
      ]);

      const overview = {
        plays: user.recentlyPlayed[0].plays.length,
        playtime: Math.round(
          (user.recentlyPlayed[0].plays.length *
            user.recentlyPlayed[0].duration_ms) /
            60000
        ),
      };

      const { artists } = await fastify.spotifyAPI({
        route: `artists?ids=${track.artists.map(({ id }) => id).join(",")}`,
        token: user.lastSpotifyToken,
      });

      const response = {
        track: {
          album: {
            name: track.album.name,
            id: track.album.id,
          },
          artists: artists.map(({ name, id, images }) => {
            return { name, id, image: images.length ? images[0].url : "" };
          }),
          name: track.name,
          preview_url: track.preview_url,
          popularity: track.popularity,
          image: track.album.images.length ? track.album.images[0].url : "",
          link: track.external_urls.spotify,
          duration_ms: track.duration_ms,
          release_date: track.album.release_date,
          danceability: audioFeatures.danceability,
          energy: audioFeatures.energy,
          key: audioFeatures.key,
          loudness: audioFeatures.loudness,
          mode: audioFeatures.mode,
          speechiness: audioFeatures.speechiness,
          acousticness: audioFeatures.acousticness,
          instrumentalness: audioFeatures.instrumentalness,
          liveness: audioFeatures.liveness,
          valence: audioFeatures.valence,
          tempo: audioFeatures.tempo,
        },
        overview,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
