class Room {
    constructor(id) {
      this.id = id;
      this.players = new Map();
      this.gameState = {};
    }
  
    addPlayer(player) {
      this.players.set(player.id, player);
    }
  
    removePlayer(playerId) {
      this.players.delete(playerId);
    }

}

export default Room;
  