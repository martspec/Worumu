const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Game state
const gameState = {
  players: new Map(),
  worldData: {}
};

// Socket.io
io.on('connection', (socket) => {
  console.log(`🎮 Player connected: ${socket.id}`);
  
  const player = {
    id: socket.id,
    position: { x: 0, y: 50, z: 0 },
    rotation: { x: 0, y: 0 },
    health: 100,
    stamina: 100,
    hunger: 100
  };
  
  gameState.players.set(socket.id, player);
  
  // Send world init to client
  socket.emit('world:init', {
    CHUNK_SIZE: 100,
    MAX_HEIGHT: 50,
    WORLD_SIZE: 10000
  });
  
  // Player movement
  socket.on('player:move', (data) => {
    const p = gameState.players.get(socket.id);
    if (p) {
      p.position = data.position;
      p.rotation = data.rotation;
      socket.broadcast.emit('player:moved', {
        playerId: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    console.log(`👋 Player disconnected: ${socket.id}`);
    io.emit('player:left', { playerId: socket.id });
  });
});

// REST API
app.get('/health', (req, res) => {
  res.json({ status: 'ok', players: gameState.players.size });
});

app.get('/players', (req, res) => {
  const players = Array.from(gameState.players.values());
  res.json({ count: players.length, players });
});

// Start
server.listen(PORT, () => {
  console.log(`\n🚀 WORUMU Backend running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
  console.log(`🎮 https://worumu-backend.railway.app (after deployment)\n`);
});
