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
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
  
  // Send all existing players to new player
  const otherPlayers = Array.from(gameState.players.values())
    .filter(p => p.id !== socket.id);
  socket.emit('players:list', otherPlayers);
  
  // Notify others about new player
  socket.broadcast.emit('player:joined', player);
  
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
  res.json({ 
    status: 'ok', 
    players: gameState.players.size,
    environment: NODE_ENV,
    timestamp: new Date()
  });
});

app.get('/players', (req, res) => {
  const players = Array.from(gameState.players.values());
  res.json({ count: players.length, players });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'WORUMU Backend Server',
    status: 'running',
    frontend: 'https://martspec.github.io/Worumu'
  });
});

// Start
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 WORUMU Backend running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
  console.log(`🎮 Frontend: https://martspec.github.io/Worumu`);
  console.log(`📊 Environment: ${NODE_ENV}\n`);
});

module.exports = { app, server, io, gameState };
