import history from "../../includes/listening-history.js";

export default async function(fastify) {
  const tracks = fastify.getSchema("listening-history");
  const headers = fastify.getSchema("cookie");
  const audioFeaturesSchema = fastify.getSchema("audioFeatures");

  const responseSchema = {
    200: {
      type: "object",
      required: ["playlist", "tracks", "status"],
      properties: {
        playlist: {
          type: "object",
          required: [
            "name",
            "image",
            "collaborative",
            "link",
            "followers",
            "owner",
            "public",
            "tracks",
          ],
          properties: {
            name: {
              type: "string",
            },
            image: {
              type: "string",
            },
            collaborative: {
              type: "boolean",
            },
            followers: {
              type: "number",
            },
            link: {
              type: "string",
            },
            public: {
              type: "boolean",
            },
            tracks: {
              type: "number",
            },
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
        tracks,
        audioFeatures: audioFeaturesSchema,
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

      reply.code(200).send(response);
    }
  );
}
