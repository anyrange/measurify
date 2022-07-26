import { addTrack } from "#server/includes/cron-workers/historyParser/tracks.js";
import { timeDiff } from "#server/utils/index.js";

export default async function (fastify) {
  fastify.get(
    "",
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
              release_date: { type: "string" },
              duration_ms: { type: "number" },
              lastPlayedAt: { type: "string", format: "date-time" },
              isPlaying: { type: "boolean" },
              isLiked: { type: "boolean" },
              rates: { $ref: "rates#" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const _id = await fastify.getId(req);
      const trackID = req.params.id;

      const mainInfo = [
        fastify.db.Track.findById(trackID)
          .populate("album", {
            name: 1,
            images: 1,
          })
          .populate("artists", {
            name: 1,
            images: 1,
          })
          .lean(),
      ];

      if (_id)
        mainInfo.push(
          fastify.db.User.findById(_id, "tokens.token country").lean()
        );

      let [track, user] = await Promise.all(mainInfo);

      const time_range = ["long_term", "medium_term", "short_term"];
      const token = user?.tokens?.token;

      if (!track || !track.audioFeatures || !track.release_date) {
        track = await addTrack(trackID, token);
        track.justAdded = true;
      }

      const DAY = 1000 * 60 * 60 * 24;
      const notUpdated =
        !track.updated_at || timeDiff(track.updated_at, new Date()) > DAY;

      if (!track.justAdded && notUpdated) addTrack(trackID, token);

      // for unauthenticated users
      if (!token) {
        return reply.send({
          track: {
            id: trackID,
            name: track.name,
            image: track.images.highQuality,
            album: {
              id: track.album._id,
              name: track.album.name,
              image: track.album.images.mediumQuality,
            },
            artists: track.artists.map((artist) => ({
              id: artist._id,
              name: artist.name,
              image: artist.images.mediumQuality,
            })),
          },
          ...track,
        });
      }

      const request = [
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

      const [trcLT, trcMT, trcST, [isLiked], currentPlayer, [overview]] =
        await Promise.all(request);

      const rates = {
        LT: findPlace(track.name, trcLT),
        MT: findPlace(track.name, trcMT),
        ST: findPlace(track.name, trcST),
      };

      const response = {
        track: {
          id: trackID,
          name: track.name,
          image: track.images.highQuality,
          album: {
            id: track.album._id,
            name: track.album.name,
            image: track.album.images.mediumQuality,
          },
          artists: track.artists.map((artist) => ({
            id: artist._id,
            name: artist.name,
            image: artist.images.mediumQuality,
          })),
        },
        ...track,
        lastPlayedAt: overview?.lastPlayedAt || "",
        isLiked,
        overview: {
          plays: overview?.plays || 0,
          playtime: Math.round((overview?.playtime || 0) / 60 / 1000),
        },
        rates,
        isPlaying: currentPlayer.item?.id === trackID,
      };

      return reply.send(response);
    }
  );
}

const findPlace = (name, { items }) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == name) return i + 1;
  }
  return 0;
};
