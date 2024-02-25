class Player {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.state = 'waiting';
      this.room = null;
      this.position = 0;
      this.cards = [];
      this.chips = 1000;
      this.isDealer = false;
    }

    canBet(player, amount) {
      return (amount && player.chips >= amount);
    }
}

export default Player;