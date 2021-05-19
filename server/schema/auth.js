export default {
  $id: "auth",
  type: "object",
  required: ["authorization"],
  properties: {
    authorization: {
      type: "string",
      minLength: 24,
      maxLength: 24,
    },
  },
};
