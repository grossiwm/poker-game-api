class Game {
    static gameRounds = ['preflop', 'flop', 'turn', 'river'];

    constructor() {
      this.round = 'preflop';
      this.pot = 0;
      this.limitOfPlayers = 10;
      this.players = [];
    }

    countPlayers() {
        return this.players.length;
    }

    addPlayer(player) {
        player.position = this.players.length;
        this.players.push(player);
    }
    
    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id != playerId);
    }

    hasVacantSeat() {
        return this.countPlayers() < this.limitOfPlayers;
    }

    goToNextRound() {
        const newIndex = Game.gameRounds.indexOf(this.round) + 1;
        if (newIndex < Game.gameRounds.length) {
            this.round = Game.gameRounds[newIndex];
        }
        this.players.forEach(player => {
            player.state = 'waiting';
        });
    }

    goToNextHand() {
        this.round = 'preflop';

        this.players.forEach(player => {
            player.state = 'waiting';
        });
    }

    isRiverRound() {
        return this.round === 'river';
    }

    hasPlayersWaiting() {
        return this.players.filter(p => p.state == 'waiting').length == 0;
    }
}
export default Game;