const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const app = express();    // <-- Create express app first

// Add this route **after** creating app
app.get('/', (req, res) => {
  res.send('Chat app backend is running');
});

app.use(cors());
app.use(express.json());

// HTTP server
const server = http.createServer(app);

// Socket.IO server (real-time)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now
  },
});

// Listen for connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data); // Send to everyone
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = { app, server, io }; // Export for testing or further use