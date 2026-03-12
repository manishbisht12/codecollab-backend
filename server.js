import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import socketHandler from "./socket/socketHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "https://codecollab-gamma.vercel.app", "http://localhost:5173"].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req, res) => {
  res.send("CodeCollab Backend Running 🚀");
});

// socket logic
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});