export default {
  $id: "cookie",
  type: "object",
  required: ["cookie"],
  properties: {
    cookie: {
      type: "string",
      pattern: "token=",
    },
  },
};
