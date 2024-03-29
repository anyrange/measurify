import fastify from "fastify"
import autoLoad from "@fastify/autoload"
import { fileURLToPath } from "url"
import { dirname, join, resolve } from "path"
import dotenv from "dotenv"

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: resolve(__dirname, "../../../.env") })

const app = fastify()

// plugins

app.register(import("@fastify/cors"), {
  origin: process.env.CLIENT_URI || "http://localhost:3000",
  credentials: true,
})

app.register(import("@fastify/compress"))

if (process.env.NODE_ENV != "production") {
  app.register(import("@fastify/swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "measurify",
        description: "measurify API documentation",
      },
    },
    uiConfig: {
      deepLinking: true,
      displayRequestDuration: true,
      "syntaxHighlight.theme": "nord",
      docExpansion: "none",
    },
    exposeRoute: true,
  })
}

// custom plugins
app.register(autoLoad, { dir: join(__dirname, "plugins") })

// schemas
app.register(autoLoad, { dir: join(__dirname, "schema") })

// routes
app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
  autoHooks: true,
  cascadeHooks: true,
})

// for ape moments
process.on("unhandledRejection", (error) =>
  console.error(`Unhandled - ${error}`)
)

export default app
