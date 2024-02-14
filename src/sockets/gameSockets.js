import Room from "../models/Room.js";
import Player from "../models/Player.js";

const rooms = {}

function setupGameSockets(io) {
    
    io.on('connection', (socket) => {
        let roomIDgot = '';

        socket.on('joinGameRoom', ({roomID, playerData}) => {
          socket.join(roomID);
          console.log("entrou na sala")
          if (!rooms[roomID]) {
            rooms[roomID] = new Room(roomID);
          }
      
          roomIDgot = roomID;
          socket.join(roomID);
          console.log(`Socket ${socket.id} entrou na sala ${roomID}`);
          const player = new Player(socket.id, playerData.name);
          rooms[roomID].addPlayer(player);
          io.to(roomID).emit('playersList', Array.from(rooms[roomID].players.values()));
        })
        
        socket.on('chatMessage', ({ roomID, message }) => {
          const playerData = rooms[roomID]?.players.get(socket.id);
          if (playerData) {
            io.to(roomID).emit('newChatMessage', { 
              sender: playerData.name, 
              message: message,
              timestamp: new Date()
            });
          }
        });
      
        socket.on('disconnect', () => {
          console.log('Player ', socket.id + ' disconnected');
          if (roomIDgot) {
            rooms[roomIDgot].removePlayer(socket.id);
            io.to(roomIDgot).emit('playersList', Array.from(rooms[roomIDgot].players.values()));
          }
        });
    });
};

export default setupGameSockets;