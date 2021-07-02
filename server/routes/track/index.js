import User from "../../models/User.js";

export default async function(fastify) {
  const responseSchema = {
    200: {
      type: "object",
      properties: {
        track: fastify.getSchema("track"),
        overview: fastify.getSchema("overview"),
        audioFeatures: fastify.getSchema("audioFeatures"),
        status: { type: "number" },
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
          properties: { id: { type: "string", minLength: 22, maxLength: 22 } },
        },
        response: responseSchema,
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const trackID = req.params.id;

      const user = await User.findOne(
        { _id },
        {
          lastSpotifyToken: 1,
        }
      );

      if (!user) throw new this.CustomError("User not found", 404);

      const [track, audioFeatures, listenedOne] = await Promise.all([
        fastify.spotifyAPI({
          route: `tracks/${trackID}`,
          token: user.lastSpotifyToken,
        }),
        fastify.spotifyAPI({
          route: `audio-features/${trackID}`,
          token: user.lastSpotifyToken,
        }),
        User.findOne(
          { _id, "recentlyPlayed.id": trackID },
          { "recentlyPlayed.$": 1 }
        ),
      ]);

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
        token: user.lastSpotifyToken,
      });

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
        audioFeatures,
        status: 200,
      };

      reply.send(response);
    }
  );
}
