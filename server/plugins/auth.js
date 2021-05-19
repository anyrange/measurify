import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("auth", (_id) => {
    if (!_id) return { message: `Unauthorized`, code: 401 };
    if (_id.length !== 24) return { message: `Invalid`, code: 400 };
    return { code: 200 };
  });
});

export default plugin;
