import si from "systeminformation";
export default async function(fastify) {
  fastify.get("", async () => {
    try {
      const [cpu, mem, os, processes, fsSize] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.processes(),
        si.fsSize(),
      ]);
      return { cpu, mem, os, processes, fsSize };
    } catch (err) {
      console.log(err);
    }
  });
}
