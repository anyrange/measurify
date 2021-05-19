export default {
  $id: "tracks",
  type: "array",
  items: {
    type: "object",
    required: ["_id", "playtime"],
    properties: {
      _id: {
        type: "object",
        required: ["id", "name", "album", "artists"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          album: {
            type: "object",
            required: ["name", "id"],
            properties: {
              name: { type: "string" },
              id: { type: "string" },
            },
          },
          artists: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "name"],
              properties: {
                name: { type: "string" },
                id: { type: "string" },
              },
            },
          },
        },
      },
      playtime: { type: "number" },
    },
  },
};
