class Player {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.state = 'waiting';
      this.room = null;
      this.hasSeat = false;
      this.position = 0;
    }
}

export default Player;