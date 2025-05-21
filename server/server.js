import express from "express";
// import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "node:http";
import { Server } from "socket.io";

const getId = () => {
  return uuidv4();
};

// config -----------
const config = {
  port: process.env.PORT || 3080,
};
// ------------------

const app = express();
// app.use(cors());

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

  socket.on("joined-chat", ({ username, roomId }) => {
    socket.join(roomId);
    io.to(roomId).emit("notification", {
      date: new Date().toISOString(),
      message: `${username} joined`,
      username,
      socketId: socket.id,
      id: getId(),
    });
    io.to(roomId).emit("new-participant", {
      date: new Date().toISOString(),
      username,
      socketId: socket.id,
      id: getId(),
    });
    // syncing data between clients
    io.to(roomId).emit("sync-participant", {
      participantUsername: username,
      participantSocketId: socket.id,
      id: getId(),
    });
  });

  socket.on("left-chat", ({ username, roomId }) => {
    socket.leave(roomId);
    io.to(roomId).emit("notification", {
      message: `${username} left`,
      username,
      socketId: socket.id,
      id: getId(),
    });
  });

  socket.on("send-message", (message) => {
    const { roomId } = message;
    io.to(roomId).emit("receive-message", {
      ...message,
      date: new Date().toISOString(),
      socketId: socket.id,
      id: getId(),
    });
  });

  socket.on("nuke", (message) => {
    const { roomId } = message;
    io.to(roomId).emit("nuke", {
      ...message,
    });
  });

  // clients send back the data they have
  socket.on("sync-participant-data", ({ socketId, data }) => {
    // server sends data back to the client who requested the data for sync
    io.to(socketId).emit("participant-data", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(config.port, () => {
  console.log(`Server listening\nport :: ${config.port}`);
});
