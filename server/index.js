import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("room-join", (data) => {
    const { roomId, name } = data;
    console.log("user joined room:", roomId, name);
    // io.to(socket.id).emit("welcome", {
    //   email,
    //   socketId: socket.id,
    // });
    emailToSocketIdMap.set(name, socket.id);
    socketIdToEmailMap.set(socket.id, name);
    io.to(roomId).emit("user-connected", { name, socketId: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room-join", data);

    socket.on("call-user", (data) => {
      const { to, offer } = data;
      console.log("call-user", data);
      io.to(to).emit("incoming-call", { offer, from: socket.id });
    });

    socket.on("call-accepted", (data) => {
      const { to, answer } = data;
      console.log("call-accepted", data);
      io.to(to).emit("call-accepted", { answer, from: socket.id });
    });

    socket.on("ice-candidate", (data) => {
      const { to, candidate } = data;
      console.log("ice-candidate", data);
      io.to(to).emit("ice-candidate", { candidate, from: socket.id });
    });

    socket.on("peer-negotiation", (data) => {
      const { to, offer } = data;
      console.log("peer-negotiation", data);
      io.to(to).emit("peer-negotiation", { offer, from: socket.id });
    });

    socket.on("peer-negotiation-done", (data) => {
      const { to, answer } = data;
      console.log("peer-negotiation-done", data);
      io.to(to).emit("peer-negotiation-done", { answer, from: socket.id });
    });



    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", name);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
