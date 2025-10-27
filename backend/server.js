// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "./models/MessageDB.js";

const app = express();

// ✅ Allow frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Create server
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

  // 🟢 Send previous messages to new user
  const previousMessages = await db.find({});
  socket.emit("loadMessages", previousMessages);

  // 💬 Handle new message
  socket.on("sendMessage", async (msgData) => {
    const savedMessage = await db.insert(msgData);
    io.emit("receiveMessage", savedMessage); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("Orbit Lite backend running with NeDB 🚀");
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
