"use strict";

import fp from "fastify-plugin";

export default fp(async function (fastify) {
  fastify.register(import("@fastify/jwt"), {
    secret: process.env.SECRET_COOKIE,
  });

  fastify.decorate("getId", async function (request) {
    if (!request.headers.authorization) return null;

    const token = request.headers.authorization.split(" ")[1];
    const decoded = await fastify.jwt.decode(token);
    return decoded.id;
  });

  fastify.decorate("auth", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
