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
              playlist: { $ref: "entity#" },
              collaborative: { type: "boolean" },
              followers: { type: "number" },
              public: { type: "boolean" },
              totalTracks: { type: "number" },
              owner: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  display_name: { type: "string" },
                },
              },
              isLiked: { type: "boolean" },
              favouriteTracks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ...fastify.getSchema("track").properties,
                    lastPlayedAt: { type: "string" },
                    duration_ms: { type: "number" },
                    plays: { type: "number" },
                  },
                },
              },
              audioFeatures: { $ref: "audioFeatures#" },
              content: { $ref: "tracks#/definitions/withDuration" },
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const id = req.session.get("id");
      const playlistID = req.params.id;

      const user = await fastify.db.User.findById(id, "tokens.token");

      if (!user) throw fastify.error("User not found", 404);
      const token = user.tokens.token;

      const [playlist, [isLiked], favouriteTracks] = await Promise.all([
        fastify.spotifyAPI({
          route: `playlists/${playlistID}?fields=collaborative,external_urls,followers(total),images,name,owner(display_name,id),public,tracks(total),tracks(items(track(id,name,duration_ms,album(id,name,images(url)),artists(id,name))))`,
          token,
        }),
        fastify.spotifyAPI({
          route: `playlists/${playlistID}/followers/contains?ids=${id}`,
          token,
        }),
        fastify.favouriteTracks({
          _id: id,
          filterID: playlistID,
          type: "playlist",
        }),
      ]);

      const [audioFeatures, owner] = await Promise.all([
        fastify.parseAudioFeatures(
          playlist.tracks.items.map(({ track }) => track.id),
          token
        ),
        fastify.db.User.findById(
          playlist.owner.id,
          "_id settings.username"
        ).lean(),
      ]);

      const response = {
        playlist: {
          name: playlist.name,
          id: playlist.id,
          image: playlist.images.length ? playlist.images[0].url : "",
        },
        collaborative: playlist.collaborative,
        followers: playlist.followers.total,
        owner: {
          display_name: playlist.owner.display_name,
          username: owner?.settings.username || "",
          id: playlist.owner.id,
        },
        public: playlist.public,
        totalTracks: playlist.tracks.total,
        isLiked,
        audioFeatures,
        favouriteTracks,
        content: playlist.tracks.items.map(({ track }) => formatTrack(track)),
      };

      reply.send(response);
    }
  );
}
