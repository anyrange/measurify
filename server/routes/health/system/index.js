import si from "systeminformation";
export default async function(fastify) {
  fastify.get("", { schema: { tags: ["server status"] } }, async () => {
    const [cpu, mem, os, processes, fsSize] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.processes(),
      si.fsSize(),
    ]);
    return { cpu, mem, os, processes, fsSize };
  });
}
