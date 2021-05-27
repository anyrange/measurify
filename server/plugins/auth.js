import fp from "fastify-plugin";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET_JWT;

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("auth", async (token) => {
    const decoded = await jwt.verify(token, secret);
    return decoded._id;
  });
});

export default plugin;
