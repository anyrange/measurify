import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  const year = 60 * 60 * 24 * 365;

  fastify.decorate("cookieOptions", {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: true,
    maxAge: year,
  });
});

export default plugin;
