// WORUMU Server
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Game state
const gameState = {
  players: new Map(),
  chunks: new Map(),
  entities: []
};

// Socket.io events
io.on('connection', (socket) => {
  console.log(`👤 Player connected: ${socket.id}`);

  // Send world data to client
  socket.emit('world:init', {
    chunkSize: 100,
    maxHeight: 50
  });

  // Player movement
  socket.on('player:move', (data) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      
      // Broadcast to other players
      socket.broadcast.emit('player:moved', {
        playerId: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });

  // Player disconnect
  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    console.log(`👤 Player disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/players', (req, res) => {
  const players = Array.from(gameState.players.values());
  res.json({ count: players.length, players });
});

// Start server
server.listen(PORT, () => {
  console.log(`🎮 WORUMU Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready for ${process.env.NODE_ENV || 'development'} environment`);
});

module.exports = { app, server, io, gameState };
