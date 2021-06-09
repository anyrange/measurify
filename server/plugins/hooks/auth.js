import fp from "fastify-plugin";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET_JWT;

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("user_id", null);
  fastify.addHook("preHandler", async (req) => {
    const token = req.cookies.token;
    if (token) {
      const decoded = await jwt.verify(token, secret);
      req.user_id = decoded._id;
    }
  });
});

export default plugin;
