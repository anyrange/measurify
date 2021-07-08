import history from "../../../includes/listening-history.js";

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
            required: ["artist", "tracks", "status"],
            properties: {
              artist: {
                type: "object",
                properties: {
                  followers: { type: "number" },
                  genres: { type: "array", items: { type: "string" } },
                  popularity: { type: "number" },
                  name: { type: "string" },
                  image: { type: "string" },
                  link: { type: "string" },
                },
              },
              tracks: fastify.getSchema("tracks"),
              audioFeatures: fastify.getSchema("audioFeatures"),
              rates: {
                type: "object",
                properties: {
                  art: fastify.getSchema("rates"),
                  trc: fastify.getSchema("rates"),
                },
              },
              status: { type: "number" },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const artistID = req.params.id;
      const token = await this.getToken(_id);

      const time_range = ["long_term", "medium_term", "short_term"];

      const request = [
        fastify.spotifyAPI({ route: `artists/${artistID}`, token }),
        history(_id, artistID),
        fastify
          .spotifyAPI({
            route: `artists/${artistID}/top-tracks?market=ES`,
            token,
          })
          .then(({ tracks }) => fastify.parseAudioFeatures(tracks, token)),
        time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/artists?limit=30&time_range=${range}`,
            token,
          })
        ),
        time_range.map((range) =>
          fastify.spotifyAPI({
            route: `me/top/tracks?limit=50&time_range=${range}`,
            token,
          })
        ),
      ];

      const [
        artist,
        tracks,
        audioFeatures,
        artLT,
        artMT,
        artST,
        trcLT,
        trcMT,
        trcST,
      ] = await Promise.all(request.flat(1));

      const rates = {
        art: {
          LT: findPlace(artist.name, artLT),
          MT: findPlace(artist.name, artMT),
          ST: findPlace(artist.name, artST),
        },
        trc: {
          LT: countTracks(artist.name, trcLT),
          MT: countTracks(artist.name, trcMT),
          ST: countTracks(artist.name, trcST),
        },
      };

      // response schema
      const response = {
        artist: {
          followers: artist.followers.total,
          genres: artist.genres,
          popularity: artist.popularity,
          name: artist.name,
          image: artist.images.length ? artist.images[0].url : "",
          link: artist.external_urls.spotify,
        },
        tracks,
        audioFeatures,
        rates,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}

const findPlace = (name, { items }) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == name) return i + 1;
  }
  return 0;
};

const countTracks = (name, { items }) => {
  let tracksInTop = 0;
  items.forEach((track) =>
    track.artists.forEach((artist) => {
      if (artist.name == name) tracksInTop++;
    })
  );
  return tracksInTop;
};
