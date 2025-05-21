import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

// config -----------
const config = {
  port: process.env.PORT || 3080,
};
// ------------------

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.on("finish", function () {
    console.log(req.method, decodeURI(req.url), res.statusCode);
  });
  next();
});

const server = createServer(app);
// https://chat.one0.xyz/nc/socket.io
const io = new Server(server, {
  path: "/nc/socket.io",
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);
  socket.on("send-message", (message) => {
    io.emit("receive-message", message);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(config.port, () => {
  console.log(`Server listening\nport :: ${config.port}`);
});
