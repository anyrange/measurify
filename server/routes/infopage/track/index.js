import formatTrack from "../../../utils/format-track.js";

export default async function (fastify) {
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
              track: { $ref: "track" },
              overview: { $ref: "overview#" },
              audioFeatures: { $ref: "audioFeatures#" },
              popularity: { type: "number" },
              preview_url: { type: "string" },
              release_date: { type: "string" },
              duration_ms: { type: "string" },
              lastPlayedAt: { type: "string", format: "datetime" },
              isPlaying: { type: "boolean" },
              isLiked: { type: "boolean" },
              rates: { $ref: "rates#" },
              moreTracks: { $ref: "tracks#/definitions/withDuration" },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");
      const trackID = req.params.id;

      const user = await fastify.db.User.findById(
        _id,
        "tokens.token country"
      ).lean();

      if (!user) throw fastify.error("User not found", 404);

      const token = user.tokens.token;
      const time_range = ["long_term", "medium_term", "short_term"];

      const request = [
        fastify.spotifyAPI({ route: `tracks/${trackID}`, token }),
        fastify.spotifyAPI({ route: `audio-features/${trackID}`, token }),
        ...time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/tracks?limit=50&time_range=${range}`,
            token,
          })
        ),
        fastify.spotifyAPI({
          route: `me/tracks/contains?ids=${trackID}`,
          token,
        }),
        fastify
          .spotifyAPI({
            route: `me/player/currently-playing?market=${user.country}`,
            token,
          })
          .catch(() => ({})),
        fastify.db.User.aggregate()
          .match({ _id })
          .project("listeningHistory")
          .unwind("listeningHistory")
          .match({ "listeningHistory.track": trackID })
          .lookup({
            from: "tracks",
            localField: "listeningHistory.track",
            foreignField: "_id",
            as: "tracks",
          })
          .group({
            _id: "$listeningHistory.track",
            plays: { $sum: 1 },
            playtime: { $sum: { $first: "$tracks.duration_ms" } },
            lastPlayedAt: { $max: "$listeningHistory.played_at" },
          }),
      ];

      const [
        track,
        audioFeatures,
        trcLT,
        trcMT,
        trcST,
        [isLiked],
        currentPlayer,
        [overview],
      ] = await Promise.all(request);

      const [{ artists }, { tracks: moreTracks }] = await Promise.all([
        fastify.spotifyAPI({
          route: `artists?ids=${track.artists.map(({ id }) => id).join(",")}`,
          token,
        }),
        fastify.spotifyAPI({
          route: `artists/${track.artists[0].id}/top-tracks?market=${user.country}`,
          token,
        }),
      ]);

      const rates = {
        LT: findPlace(track.name, trcLT),
        MT: findPlace(track.name, trcMT),
        ST: findPlace(track.name, trcST),
      };

      audioFeatures.popularity = track.popularity / 100;

      const response = {
        track: {
          id: track.id,
          name: track.name,
          image: track.album.images[0]?.url || "",
          album: {
            name: track.album.name,
            image: track.album.images[0]?.url || "",
            id: track.album.id,
          },
          artists: artists.map(({ name, id, images }) => ({
            name,
            id,
            image: images[0]?.url || "",
          })),
        },
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
        popularity: track.popularity,
        release_date: track.album.release_date,
        lastPlayedAt: overview?.lastPlayedAt || "",
        isLiked,
        overview: {
          plays: overview?.plays || 0,
          playtime: Math.round((overview?.playtime || 0) / 60 / 1000),
        },
        rates,
        audioFeatures,
        isPlaying: currentPlayer.item?.id === trackID,
        moreTracks: moreTracks.map((track) => formatTrack(track)),
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
