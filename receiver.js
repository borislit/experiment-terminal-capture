#!/usr/bin/env node
const { createServer } = require("http");
const { readFileSync } = require("fs");
const { WebSocketServer } = require("ws");

const server = createServer();
const wss = new WebSocketServer({ server });

const connections = [];
wss.on("connection", function connection(ws) {
  connections.push(ws);
  console.log("CONNECTION");
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    connections.filter(conn => conn !== ws).forEach(conn => conn.send(data.toString()));
  });

  // var stdin = process.openStdin();

  // var data = "";

  // stdin.on("data", function (chunk) {
  //   console.log("GOT", chunk.toString("utf8"));

  //   // data += chunk;
  // });

  // stdin.on("end", function () {
  //   console.log("DATA:\n" + data + "\nEND DATA");
  // });
});

server.listen(3002);
