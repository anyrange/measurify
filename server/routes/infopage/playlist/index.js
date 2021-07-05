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
                },
              },
              tracks: fastify.getSchema("tracks"),
              audioFeatures: fastify.getSchema("audioFeatures"),
              status: { type: "number" },
            },
          },
        },
      },
    },
    async function(req, reply) {
      const _id = await fastify.auth(req);
      const playlistID = req.params.id;

      const token = await this.getToken(_id);

      const [playlist, tracks] = await Promise.all([
        fastify.spotifyAPI({
          route: `playlists/${playlistID}?fields=collaborative,external_urls,followers(total),images,name,owner(display_name,id),public,tracks(total),tracks(items(track(id)))`,
          token,
        }),
        history(_id, playlistID),
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
          owner: { name: playlist.owner.display_name, id: playlist.owner.id },
          public: playlist.public,
          tracks: playlist.tracks.total,
        },
        audioFeatures,
        tracks,
        status: 200,
      };

      reply.send(response);
    }
  );
}
