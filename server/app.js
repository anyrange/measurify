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
app.all("/*", (request, reply) => {
  reply.code(400).send({ message: "Service not found" });
});

// for ape moments
process.on("unhandledRejection", (error) => {
  console.log("Unhandled - " + error);
});

export default app;
