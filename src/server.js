const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const players = new Map();

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
  console.log("Player " + socket.id + " connected");
  players.set(socket.id, { name: "Player_"+socket.id });

  io.emit('playersList', Array.from(players.values()));

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
    
    players.delete(socket.id);

    io.emit('playersList', Array.from(players.values()));
  });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

app.get('/deal/:cardType', (req, res) => {
  const { cardType } = req.params;

  switch (cardType) {
    case 'flop':
      // Emitir o flop
      io.emit('dealFlop', { /* dados do flop */ });
      break;
    case 'turn':
      // Emitir o turn
      io.emit('dealTurn', { /* dados do turn */ });
      break;
    case 'river':
      // Emitir o river
      io.emit('dealRiver', { /* dados do river */ });
      break;
    default:
      res.status(400).send('Tipo de carta inválido');
      return;
  }

  res.send(`Emitido ${cardType}`);
});