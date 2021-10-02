"use strict";

import fp from "fastify-plugin";

export default fp(async function (fastify) {
  const YEAR = 60 * 60 * 24 * 365;
  const domain = new URL(process.env.VITE_SERVER_URI).hostname;

  fastify.register(import("fastify-secure-session"), {
    cookieName: "sw_session",
    key: Buffer.from(process.env.SECRET_COOKIE, "hex"),
    cookie: {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: YEAR,
      domain,
    },
  });

  fastify.decorate("auth", async function (request, reply) {
    if (!request.session.get("id"))
      return reply.code(401).send({ message: "Unauthorized" });
  });
});
