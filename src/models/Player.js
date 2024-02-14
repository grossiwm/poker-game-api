class Player {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.state = 'waiting'; // Exemplos: 'waiting', 'playing', 'folded'
      this.room = null; // Referência à sala em que o jogador está
    }
}

export default Player;
  