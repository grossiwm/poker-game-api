import Room from "../models/Room.js";
import Player from "../models/Player.js";

const rooms = {}

const getDealerMessageFromPlayerAction = (playerName, action, amount) => {

    switch (action) {
        case 'check':
            return 'Player ' + playerName + ' check'
        case 'bet':
            return 'Player ' + playerName + ' bet ' + amount;
        case 'fold':
            return 'Player ' + playerName + ' folded';
        case 'raise':
            return 'Player ' + playerName + ' raise ' + amount;
        default:
            return null;
    }
}

function setupGameSockets(io) {

    io.on('connection', (socket) => {
        let roomIDgot = '';

        socket.on('joinGameRoom', ({ roomID, playerData }) => {
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

            socket.on('playerAction', ({ action, amount }) => {
                const player = rooms[roomIDgot].players.get(socket.id);
                const message = getDealerMessageFromPlayerAction(player.name, action, amount);

                if (message) {
                    io.to(roomIDgot).emit('newChatMessage', {
                        sender: 'Dealer',
                        message: getDealerMessageFromPlayerAction(player.name, action, amount),
                        timestamp: new Date()
                    });
                }

            })

            socket.on('chatMessage', ({ message }) => {
                const playerData = rooms[roomIDgot]?.players.get(socket.id);
                if (playerData) {
                    io.to(roomIDgot).emit('newChatMessage', {
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

    });
};

export default setupGameSockets;