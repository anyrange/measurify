export default {
  $id: "listening-history",
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      image: { type: "string" },
      duration_ms: { type: "number" },
      playtime: { type: "number" },
      played_at: { type: "string" },
      lastPlayedAt: { type: "string" },
      album: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
      artists: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  },
};
