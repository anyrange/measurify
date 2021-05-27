import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import addSchemas from "./schema/index.js";

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

app.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

addSchemas(app);

app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.all("/*", (request, reply) => {
  reply.code(404).send({ message: "Service not found" });
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});

export default app;
