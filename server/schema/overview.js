export default {
  $id: "overview",
  type: "array",
  items: {
    type: "object",
    required: ["date", "plays", "duration"],
    properties: {
      date: { type: "string" },
      plays: { type: "number" },
      duration: { type: "number" },
    },
  },
};
