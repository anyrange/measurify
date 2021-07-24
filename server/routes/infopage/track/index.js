import User from "../../../models/User.js";

export default async function(fastify) {
  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 22, maxLength: 22 } },
        },
        response: {
          200: {
            type: "object",
            properties: {
              track: fastify.getSchema("track"),
              overview: fastify.getSchema("overview"),
              audioFeatures: fastify.getSchema("audioFeatures"),
              rates: fastify.getSchema("rates"),
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const trackID = req.params.id;

      const token = await fastify.getToken(_id);

      const time_range = ["long_term", "medium_term", "short_term"];

      const request = [
        fastify.spotifyAPI({ route: `tracks/${trackID}`, token }),
        fastify.spotifyAPI({ route: `audio-features/${trackID}`, token }),
        User.findOne(
          { _id, "recentlyPlayed.id": trackID },
          { "recentlyPlayed.$": 1 }
        ),
        time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/tracks?limit=50&time_range=${range}`,
            token,
          })
        ),
      ];

      const [
        track,
        audioFeatures,
        listenedOne,
        trcLT,
        trcMT,
        trcST,
      ] = await Promise.all(request.flat(1));

      const overview = {
        plays: listenedOne?.recentlyPlayed[0].plays.length || 0,
        playtime:
          Math.round(
            (listenedOne?.recentlyPlayed[0].plays.length *
              listenedOne?.recentlyPlayed[0].duration_ms) /
              60000
          ) || 0,
      };

      const { artists } = await fastify.spotifyAPI({
        route: `artists?ids=${track.artists.map(({ id }) => id).join(",")}`,
        token,
      });

      const rates = {
        LT: findPlace(track.name, trcLT),
        MT: findPlace(track.name, trcMT),
        ST: findPlace(track.name, trcST),
      };

      const response = {
        track: {
          album: { name: track.album.name, id: track.album.id },
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
        },
        overview,
        rates,
        audioFeatures,
        status: 200,
      };

      reply.send(response);
    }
  );
}

const findPlace = (name, { items }) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == name) return i + 1;
  }
  return 0;
};
