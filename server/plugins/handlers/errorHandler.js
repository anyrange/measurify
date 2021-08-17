import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.setErrorHandler((error, request, reply) => {
    const { message, status, validation, name } = error;

    if (error instanceof fastify.CustomError)
      return reply.status(status).send({
        message,
        status,
      });

    if (validation) {
      const { status, message } = validate(error);
      return reply.code(status).send({ message, status });
    }

    switch (name) {
      case "JsonWebTokenError":
        reply.code(400).send({ message, status: 400 });
        break;
      case "FetchError":
        console.log(`${name}: ${message}`);
        reply.code(400).send({ message, status: 400 });
        break;
      case "MongooseError":
        console.log(`${name}: ${message}`);
        reply
          .code(503)
          .header("Retry-After", 3000)
          .send({ message: "Try again later", status: 503 });
        break;
      default:
        console.log(error);
        reply
          .status(500)
          .send({ message: "Something went wrong!", status: 500 });
        break;
    }
  });
});

const validate = (validationError) => {
  const context = validationError.validationContext;

  switch (context) {
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
};
export default plugin;
