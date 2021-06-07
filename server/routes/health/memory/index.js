export default async function(fastify) {
  fastify.get("", { websocket: true }, (connection) => {
    const sendMessage = () => {
      const { heapUsed, rss, heapTotal, external } = process.memoryUsage();
      connection.socket.send(
        JSON.stringify({
          heapUsed,
          rss,
          heapTotal,
          external,
          date: new Date(),
        })
      );
    };

    const sender = setInterval(sendMessage, 5000);
    connection.socket.on("close", () => clearInterval(sender));
  });
}
