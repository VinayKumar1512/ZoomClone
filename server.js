const express = require("express");
const app = express();
const ejs = require("ejs");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

//using urlparams
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

//creating a connection
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("message",message =>{
      io.to(roomId).emit("createMessage",message);
    })
  });
});
server.listen(3000, function () {
  console.log("Server is Running at Port 3000");
});
