const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const gameState = {
  players: new Map()
};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  const player = {
    id: socket.id,
    position: { x: 0, y: 50, z: 0 },
    health: 100
  };
  
  gameState.players.set(socket.id, player);
  socket.emit('init', { playerId: socket.id });
  socket.broadcast.emit('playerJoined', player);
  
  socket.on('playerMove', (data) => {
    const p = gameState.players.get(socket.id);
    if (p) {
      p.position = data.position;
      socket.broadcast.emit('playerMoved', { playerId: socket.id, position: data.position });
    }
  });
  
  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    console.log('Player disconnected:', socket.id);
    io.emit('playerLeft', { playerId: socket.id });
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', players: gameState.players.size });
});

app.get('/health', (req, res) => {
  res.json({ status: 'running', players: gameState.players.size });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready\n`);
});
