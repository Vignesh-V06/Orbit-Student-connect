// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "./models/MessageDB.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ✅ WebSocket logic
io.on("connection", async (socket) => {
  console.log("✅ User connected:", socket.id);

  // 🟢 Send previous messages sorted by time
  const previousMessages = await db.find({}).sort({ timestamp: 1 });
  socket.emit("loadMessages", previousMessages);

  // 💬 Handle new message
  socket.on("sendMessage", async (msgData) => {
    // add timestamp if not sent
    const messageWithTime = { ...msgData, timestamp: Date.now() };

    const savedMessage = await db.insert(messageWithTime);
    io.emit("receiveMessage", savedMessage); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Orbit Lite backend running with NeDB 🚀");
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
