import history from "../../includes/listening-history.js";

export default async function(fastify) {
  const tracks = fastify.getSchema("listening-history");
  const headers = fastify.getSchema("cookie");

  const responseSchema = {
    200: {
      type: "object",
      required: ["album", "tracks", "status"],
      properties: {
        album: {
          type: "object",
          required: [
            "name",
            "image",
            "popularity",
            "release_date",
            "total_tracks",
            "link",
            "genres",
            "artists",
          ],
          properties: {
            name: {
              type: "string",
            },
            image: {
              type: "string",
            },
            popularity: {
              type: "number",
            },
            release_date: {
              type: "string",
            },
            total_tracks: {
              type: "number",
            },
            link: {
              type: "string",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
            artist: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "id"],
                properties: {
                  name: { type: "string" },
                  id: { type: "string" },
                },
              },
            },
          },
        },
        tracks,
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
      const albumID = req.params.id;

      const token = await this.getToken(_id);

      const album = await fastify.spotifyAPI({
        route: `albums/${albumID}`,
        token,
      });

      if (album.error)
        throw new this.CustomError(
          album.error.message,
          album.error.status || 500
        );

      const tracks = await history(_id, albumID);

      const response = {
        album: {
          name: album.name,
          image: album.images.length ? album.images[0].url : "",
          popularity: album.popularity,
          release_date: album.release_date,
          total_tracks: album.total_tracks,
          link: album.external_urls.spotify,
          genres: album.genres,
          artists: album.artists.map(({ name, id }) => {
            return { name, id };
          }),
        },
        tracks,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
