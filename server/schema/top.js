export default {
  $id: "top",
  type: "object",
  properties: {
    tracks: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "image", "name", "playtime"],
        properties: {
          id: {
            type: "string",
          },
          image: {
            type: "string",
          },
          name: {
            type: "string",
          },
          playtime: {
            type: "number",
          },
        },
      },
    },
    albums: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "image", "name", "playtime"],
        properties: {
          id: {
            type: "string",
          },
          image: {
            type: "string",
          },
          name: {
            type: "string",
          },
          playtime: {
            type: "number",
          },
        },
      },
    },
    artists: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "image", "name", "playtime"],
        properties: {
          id: {
            type: "string",
          },
          image: {
            type: "string",
          },
          name: {
            type: "string",
          },
          playtime: {
            type: "number",
          },
        },
      },
    },
    playlists: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "image", "name", "playtime"],
        properties: {
          id: {
            type: "string",
          },
          image: {
            type: "string",
          },
          name: {
            type: "string",
          },
          playtime: {
            type: "number",
          },
        },
      },
    },
  },
};
