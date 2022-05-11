const { readFileSync } = require("fs");

import fastify from "fastify";
import fastifyWebsocket, { SocketStream } from "fastify-websocket";

const server = fastify();
server.register(fastifyWebsocket);
const db: any[] = [];

server.get("/session/current", async (request, reply) => {
  return { data: db };
});

// const server = createServer();
// const wss = new WebSocketServer({ server });

const connections: SocketStream[] = [];

server.get(
  "/",
  { websocket: true },
  (connection /* SocketStream */, req /* FastifyRequest */) => {
    console.log("connection");
    connections.push(connection);
    connection.socket.on("message", (message) => {
      console.log("received: %s", message);
      db.push(message);
      connections
        .filter((conn) => conn !== connection)
        .forEach((conn) => conn.socket.send(message.toString()));
    });
  }
);

// wss.on("connection", function connection(ws) {
//   connections.push(ws);
//   console.log("CONNECTION");
//   ws.on("message", function message(data) {
//     console.log("received: %s", data);
//     db.push(data);
//     connections.filter(conn => conn !== ws).forEach(conn => conn.send(data.toString()));
//   });

// var stdin = process.openStdin();

// var data = "";

// stdin.on("data", function (chunk) {
//   console.log("GOT", chunk.toString("utf8"));

//   // data += chunk;
// });

// stdin.on("end", function () {
//   console.log("DATA:\n" + data + "\nEND DATA");
// });
// });

server.listen(3002);
