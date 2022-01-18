#!/usr/bin/env node
const { createServer } = require("http");
const { readFileSync } = require("fs");
const { WebSocketServer } = require("ws");

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  var stdin = process.openStdin();

  var data = "";

  stdin.on("data", function (chunk) {
    console.log("GOT", chunk.toString("utf8"));

    ws.send(chunk.toString("utf8"));
    // data += chunk;
  });

  stdin.on("end", function () {
    console.log("DATA:\n" + data + "\nEND DATA");
  });
});

server.listen(3002);
