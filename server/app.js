import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify();

// plugins
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

if (process.env.NODE_ENV != "production") {
  app.register(import("fastify-swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "Spotiworm",
        description: "Spotiworm API documentation",
      },
    },
    uiConfig: {
      deepLinking: true,
      displayRequestDuration: true,
      "syntaxHighlight.theme": "nord",
      docExpansion: "none",
    },
    exposeRoute: true,
  });
}

// custom plugins
app.register(autoLoad, { dir: join(__dirname, "plugins") });

// schemas
app.register(autoLoad, { dir: join(__dirname, "schema") });

// routes
app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
  autoHooks: true,
  cascadeHooks: true,
});

// for ape moments
process.on("unhandledRejection", (error) =>
  console.error(`Unhandled - ${error}`)
);

export default app;
