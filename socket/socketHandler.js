import {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser
} from "../utils/users.js";

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // join room
    socket.on("join-room", ({ roomId, username }) => {
        
      const user = addUser({
        socketId: socket.id,
        username,
        roomId
      });

      socket.join(roomId);

      // send user list
      io.to(roomId).emit("room-users", getUsersInRoom(roomId));

      // notify others
      socket.to(roomId).emit("user-joined", {
        username,
        socketId: socket.id
      });

      console.log(`${username} joined room ${roomId}`);
    });

    // code change event
    socket.on("code-change", ({ roomId, code, fileName }) => {

      socket.to(roomId).emit("code-update", { code, fileName });

    });

    // sync code for new user
    socket.on("sync-code", ({ socketId, code, fileName }) => {

      io.to(socketId).emit("code-update", { code, fileName });

    });

    // chat message event
    socket.on("send-message", ({ roomId, message, username }) => {

      io.to(roomId).emit("receive-message", {
        message,
        username,
        socketId: socket.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

    });

    // file system events (open, toggle, create, delete)
    socket.on("file-system-update", ({ roomId, type, data }) => {

      socket.to(roomId).emit("file-system-sync", { type, data });

    });

    // disconnect
    socket.on("disconnect", () => {

      const user = removeUser(socket.id);

      if (user) {

        io.to(user.roomId).emit("room-users",
          getUsersInRoom(user.roomId)
        );

        io.to(user.roomId).emit("user-left", {
          username: user.username
        });

        console.log(`${user.username} left room`);
      }

    });

  });

};

export default socketHandler;