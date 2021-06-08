import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify();

const WHITE_LIST = process.env.URI_LIST.split(",");
app.register(import("fastify-cors"), {
  origin: WHITE_LIST,
  credentials: true,
});

const secret = process.env.SECRET_COOKIE;
app.register(import("fastify-cookie"), {
  secret,
  parseOptions: {},
});

app.register(import("fastify-websocket"));

// plugins
app.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

// schemas
const schemas = fs.readdirSync(join(__dirname, "./schema"));
schemas.forEach((schema) =>
  import(`./schema/${schema}`).then((module) => app.addSchema(module.default))
);

// routes
app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.setNotFoundHandler((req, reply) => {
  reply.code(400).send({ message: "Service not found", status: 404 });
});

// for ape moments
process.on("unhandledRejection", (error) => {
  console.log("Unhandled - " + error);
});

app.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const { status, message } = app.validate(error);
    return reply.code(status).send({ message, status });
  }

  switch (error.name) {
    case "JsonWebTokenError":
      reply.code(400).send({ message: error.message, status: 400 });
      break;
    case "FetchError":
      console.log(`${error.name}: ${error.message}`);
      reply.code(400).send({ message: error.message, status: 400 });
      break;
    case "MongooseError":
      console.log(`${error.name}: ${error.message}`);
      reply
        .code(503)
        .header("Retry-After", 3000)
        .send({ message: "Try again later", status: 503 });
      break;
    default:
      reply.status(500).send({ message: "Something went wrong!", status: 500 });
      console.log(error);
      break;
  }
});

export default app;
