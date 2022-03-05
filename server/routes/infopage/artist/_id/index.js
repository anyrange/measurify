import { addArtist } from "#server/includes/cron-workers/historyParser/artists.js";
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
            definitions: {
              tracksInTop: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    place: { type: "number" },
                    id: { type: "string" },
                  },
                },
              },
            },
            required: ["artist", "followers", "genres", "audioFeatures"],
            properties: {
              artist: { $ref: "entity#" },
              followers: { type: "number" },
              genres: { type: "array", items: { type: "string" } },
              isLiked: { type: "boolean" },
              audioFeatures: { $ref: "audioFeatures#" },
              rates: {
                type: "object",
                properties: {
                  art: { $ref: "rates#" },
                  trc: {
                    type: "object",
                    properties: {
                      LT: { $ref: "#/definitions/tracksInTop" },
                      MT: { $ref: "#/definitions/tracksInTop" },
                      ST: { $ref: "#/definitions/tracksInTop" },
                    },
                  },
                },
              },
              favouriteTracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    lastPlayedAt: { type: "string", format: "datetime" },
                    duration_ms: { type: "number" },
                    plays: { type: "number" },
                  },
                },
              },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const _id = req.session.get("id");
      const artistID = req.params.id;

      const mainInfo = [fastify.db.Artist.findById(artistID).lean()];

      if (_id)
        mainInfo.push(
          fastify.db.User.findById(_id, "tokens.token country").lean()
        );

      let [artist, user] = await Promise.all(mainInfo);

      const time_range = ["long_term", "medium_term", "short_term"];
      const token = user?.tokens?.token;

      if (!artist || !artist.audioFeatures || !artist.followers) {
        artist = await addArtist(artistID, token);
        artist.justAdded = true;
      }

      const DAY = 1000 * 60 * 60 * 24;
      const notUpdated =
        !artist.updated_at || timeDiff(artist.updated_at, new Date()) > DAY;

      if (!artist.justAdded && notUpdated) addArtist(artistID, token);

      // for unauthenticated users
      if (!token) {
        return reply.send({
          artist: {
            id: artistID,
            name: artist.name,
            image: artist.images.highQuality,
          },
          ...artist,
        });
      }

      const request = [
        ...time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/artists?limit=30&time_range=${range}`,
            token,
          })
        ),
        ...time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/tracks?limit=50&time_range=${range}`,
            token,
          })
        ),
        fastify.spotifyAPI({
          route: `me/following/contains?type=artist&ids=${artistID}`,
          token,
        }),
        fastify.favouriteTracks({ _id, filterID: artistID, type: "artist" }),
      ];

      const [
        artLT,
        artMT,
        artST,
        trcLT,
        trcMT,
        trcST,
        [isLiked],
        favouriteTracks,
      ] = await Promise.all(request);

      const rates = {
        art: {
          LT: findPlace(artist.name, artLT),
          MT: findPlace(artist.name, artMT),
          ST: findPlace(artist.name, artST),
        },
        trc: {
          LT: findTracks(artist.name, trcLT),
          MT: findTracks(artist.name, trcMT),
          ST: findTracks(artist.name, trcST),
        },
      };

      // response schema
      const response = {
        artist: {
          id: artistID,
          name: artist.name,
          image: artist.images.highQuality,
        },
        ...artist,
        isLiked,
        favouriteTracks,
        rates,
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

const findTracks = (name, { items }) => {
  const tracksInTop = [];
  items.forEach((track, index) =>
    track.artists.forEach((artist) => {
      if (artist.name == name)
        tracksInTop.push({ name: track.name, place: index + 1, id: track.id });
    })
  );
  return tracksInTop;
};
