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

const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";

const URI = new URL(FRONTEND_URI);

const WHITE_LIST = [FRONTEND_URI, `${URI.protocol}//master--${URI.host}`];

app.register(import("fastify-cors"), {
  origin: WHITE_LIST,
  credentials: true,
});

// app.register(import("./plugins/auth.js"));

addSchemas(app);

app.register(autoLoad, {
  dir: join(__dirname, "routes"),
});

app.all("/*", (request, reply) => {
  reply.code(404).send({ message: "Service not found" });
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});

export default app;
