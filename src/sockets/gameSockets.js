rooms = {}

module.exports = function setupGameSockets(io) {
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
              timestamp: new Date()
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
};
