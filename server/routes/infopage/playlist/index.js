import history from "../../../includes/listening-history.js";
import User from "../../../models/User.js";

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
            required: ["playlist", "tracks", "status"],
            properties: {
              playlist: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  image: { type: "string" },
                  collaborative: { type: "boolean" },
                  followers: { type: "number" },
                  link: { type: "string" },
                  public: { type: "boolean" },
                  tracks: { type: "number" },
                  owner: {
                    type: "object",
                    required: ["name", "id"],
                    properties: {
                      name: { type: "string" },
                      id: { type: "string" },
                    },
                  },
                  isLiked: { type: "boolean" },
                },
              },
              tracks: fastify.getSchema("tracks"),
              audioFeatures: fastify.getSchema("audioFeatures"),
              status: { type: "number" },
            },
          },
        },
        tags: ["infopages"],
      },
    },
    async function (req, reply) {
      const { _id } = req;
      const playlistID = req.params.id;

      const {
        lastSpotifyToken: token,
        customID,
        spotifyID,
      } = await User.findById(_id, "lastSpotifyToken customID spotifyID");

      const [playlist, tracks, [isLiked]] = await Promise.all([
        fastify.spotifyAPI({
          route: `playlists/${playlistID}?fields=collaborative,external_urls,followers(total),images,name,owner(display_name,id),public,tracks(total),tracks(items(track(id)))`,
          token,
        }),
        history(_id, playlistID),
        fastify.spotifyAPI({
          route: `playlists/${playlistID}/followers/contains?ids=${spotifyID}`,
          token,
        }),
      ]);

      const audioFeatures = await fastify.parseAudioFeatures(
        playlist.tracks.items.map(({ track }) => track),
        token
      );

      const response = {
        playlist: {
          name: playlist.name,
          image: playlist.images.length ? playlist.images[0].url : "",
          collaborative: playlist.collaborative,
          link: playlist.external_urls.spotify,
          followers: playlist.followers.total,
          owner: { name: playlist.owner.display_name, id: customID },
          public: playlist.public,
          tracks: playlist.tracks.total,
          isLiked,
        },
        audioFeatures,
        tracks,
      };

      reply.send(response);
    }
  );
}
