require("dotenv/config");

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;

// run middleware
app.use(cors());

// create http server
const server = http.createServer(app);

// SOCKET SETUP
const io = new Server(server, {
   cors: {
      origin: process.env.CLIENT_URL, // client URL (or "*" for all received URL)
      methods: "*", // method request from client for all
   },
});

// without specific namespace
// # default is "/"
const namespace = io.of("/chat");
namespace.on("connection", (socket) => {
   console.log("User with ID " + socket.id + " has connected to socket server");

   // ALL SOCKET LISTENER HERE
   socket.on("SEND_MESSAGE", (payload) => {
      // logic after socket receive from this event
      socket.nsp.to(payload.room).emit("RECEIVE_MESSAGE", payload);
   });

   socket.on("JOIN_ROOM", (room) => {
      if (room.lastRoom) {
         socket.leave(room.lastRoom);
      }

      socket.join(room.currentRoom);
   });
});

// with specific namespace
// const namespace = io.of("/chat")
// namespace

server.listen(PORT, () => console.log("Server is running at port " + PORT));
