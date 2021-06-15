import history from "../../includes/listening-history.js";

export default async function(fastify) {
  const tracks = fastify.getSchema("listening-history");
  const headers = fastify.getSchema("cookie");

  const responseSchema = {
    200: {
      type: "object",
      required: ["artist", "tracks", "status"],
      properties: {
        artist: {
          type: "object",
          required: ["followers", "genres", "name", "image", "link"],
          properties: {
            followers: {
              type: "number",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
            name: { type: "string" },
            image: { type: "string" },
            link: { type: "string" },
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
      const artistID = req.params.id;
      const token = await this.getToken(_id);

      const artist = await fastify.spotifyAPI({
        route: `artists/${artistID}`,
        token,
      });

      // get data for graph

      const tracks = await history(_id, artistID);

      // response schema
      const response = {
        artist: {
          followers: artist.followers.total,
          genres: artist.genres,
          name: artist.name,
          image: artist.images.length ? artist.images[0].url : "",
          link: artist.external_urls.spotify,
        },
        tracks,
        status: 200,
      };

      reply.code(200).send(response);
    }
  );
}
