import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("validate", (validationError) => {
    const context = validationError.validationContext;

    switch (context) {
      case "headers":
        return { status: 401, message: "Unauthorized" };

      case "querystring": {
        const error = validationError.validation[0];
        return {
          status: 400,
          message: `Invalid query parameters: ${error.dataPath.substring(1)} ${
            error.message
          }`,
        };
      }

      case "params":
        return { status: 400, message: "Invalid id" };

      case "body":
        return {
          status: 400,
          message: `Invalid body: ${validationError.validation[0].message}`,
        };

      default:
        return { status: 400, message: "Bad request" };
    }
  });
});

export default plugin;
