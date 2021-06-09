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
      const { status, message } = fastify.validate(error);
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
        reply
          .status(500)
          .send({ message: "Something went wrong!", status: 500 });
        console.log(error);
        break;
    }
  });
});

export default plugin;
