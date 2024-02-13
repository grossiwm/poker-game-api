const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const rooms = {};

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
  let roomIDgot = '';

  socket.on('joinGameRoom', ({roomID, playerData}) => {
    socket.join(roomID);
    console.log("entrou na sala")
    if (!rooms[roomID]) {
      rooms[roomID] = new Map(); 
    }

    roomIDgot = roomID;
    socket.join(roomID);
    console.log(`Socket ${socket.id} entrou na sala ${roomID}`);
    rooms[roomID].set(socket.id, playerData)
    io.to(roomID).emit('playersList', Array.from(rooms[roomID].values()));
  })
  
  socket.on('chatMessage', ({ roomID, message }) => {
    const playerData = rooms[roomID]?.get(socket.id);
    if (playerData) {
      io.to(roomID).emit('newChatMessage', { 
        sender: playerData.name, 
        message: message,
        timestamp: new Date() // Opcional: adicionar um carimbo de data/hora
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Player ', socket.id + ' disconnected');
    if (roomIDgot) {
      rooms[roomIDgot].delete(socket.id);
      io.to(roomIDgot).emit('playersList', Array.from(rooms[roomIDgot].values()));
    }
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