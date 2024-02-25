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
            if (!rooms[roomID]) {
                rooms[roomID] = new Room(roomID);
            }

            let room = rooms[roomID];

            roomIDgot = roomID;
            socket.join(roomID);
            const player = new Player(socket.id, playerData.name);
            room.addPlayer(player);

            const game = room.game;
            io.emit('roundSet', { round: game.round, cards: game.cards });

            if (game.hasVacantSeat()) {
                game.addPlayer(player);
                
                io.to(roomIDgot).emit('newChatMessage', {
                    sender: 'Dealer',
                    message: `Player ${player.name} started playing.`,
                    timestamp: new Date()
                });
            }

            player.cards = game.deck.dealCards(2);
            
            io.to(socket.id).emit('setPlayerCards', player.cards);

            io.to(roomID).emit('playersList', Array.from(game.players.values()));

            io.to(roomID).emit('potTotal', {pot: game.pot});

            io.to(roomID).emit('positionTurn', { position: game.getPositionPlaying() } );

            socket.on('playerAction', ({ action, amount }) => {

                const player = rooms[roomIDgot].players.get(socket.id);
                
                if (!game.playerCanPlay(player)) {
                    return;
                }

                if (player.canBet(player, amount)) {
                    game.receivePlayerBet(player, amount);
                }
                io.to(socket.id).emit('yourTurn', { yourTurn: (player.position === game.positionPlaying)} );

                io.to(roomID).emit('playersList', Array.from(game.players.values()));
                io.to(roomID).emit('potTotal', {pot: game.pot})

                const message = getDealerMessageFromPlayerAction(player.name, action, amount);
                if (action == 'folded') {
                    state == 'folded';
                } else {
                    player.state = 'played';
                }
                if (message) {
                    io.to(roomIDgot).emit('newChatMessage', {
                        sender: 'Dealer',
                        message: getDealerMessageFromPlayerAction(player.name, action, amount),
                        timestamp: new Date()
                    });
                }

                if (!game.hasPlayersWaiting()) {

                    if (game.isRiverRound()) {
                        game.goToNextHand();
                        io.to(roomID).emit('playersList', Array.from(game.players.values()));
                        game.players.forEach(p => {
                            io.to(p.id).emit('setPlayerCards', p.cards);
                        });
                    } else {
                        game.goToNextRound();
                    }

                    io.emit('roundSet', { round: game.round, cards:  game.cards});
                }

                io.to(roomID).emit('positionTurn', { position: game.getPositionPlaying() } );

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
                if (roomIDgot) {
                    const room = rooms[roomIDgot];
                    room.removePlayer(socket.id);
                    const game = room.game;
                    game.removePlayer(socket.id);
                    io.to(roomIDgot).emit('playersList', Array.from(game.players.values()));
                }

            });
        });

    });
};

export default setupGameSockets;