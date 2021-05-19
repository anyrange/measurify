export default {
  $id: "listening-history",
  type: "object",
  required: ["pages", "history"],
  properties: {
    pages: {
      type: "number",
    },
    history: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          duration_ms: { type: "string" },
          played_at: { type: "string" },
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
    },
  },
};
