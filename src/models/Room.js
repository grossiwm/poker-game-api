import Game from './Game.js';

class Room {
    constructor(id) {
      this.id = id;
      this.players = new Map();
      this.gameState = {};
      this.numberOfPlayers = 0;
      this.game = new Game()
    }
  
    addPlayer(player) {
      this.players.set(player.id, player);
    }
  
    removePlayer(playerId) {
      this.players.delete(playerId);
    }

}

export default Room;
  