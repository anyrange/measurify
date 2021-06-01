import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

export default async function(fastify) {
  fastify.get("/", (request, reply) => {
    fs.readFile(
      join(dirname(__filename), "../assets/index.html"),
      (err, html) => {
        reply
          .code(200)
          .type("text/html")
          .send(html);
      }
    );
  });
}
