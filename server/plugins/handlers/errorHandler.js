"use strict";

import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.setErrorHandler((error, req, reply) => {
    const { message, code, validation, name } = error;

    if (validation) {
      const message = validate(error);
      return reply.code(400).send({ message });
    }

    if (code === "ETIMEDOUT")
      return reply.code(503).send({ message: "Try again later" });

    if (code && typeof code === "number" && code > 200 && code < 600)
      return reply.code(code).send({ message });

    switch (name) {
      case "JsonWebTokenError":
        reply.code(400).send({ message, status: 400 });
        break;
      case "FetchError":
        reply.code(400).send({ message, status: 400 });
        break;
      case "MongooseError":
        console.log(error);
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

const validate = ({ validationContext, validation }) => {
  const result = validation[0];
  const errorVar = result.dataPath.substring(1);
  const message = `${errorVar} ${result.message}`;

  switch (validationContext) {
    case "querystring":
      return `Invalid query parameters: ${message}`;
    case "params":
      return `Invalid ${errorVar}`;
    case "body":
      return `Invalid body: ${message}`;
    default:
      return "Bad request";
  }
};

export default plugin;
