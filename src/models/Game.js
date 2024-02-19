import Deck from './Deck.js';

class Game {
    static gameRounds = ['preflop', 'flop', 'turn', 'river'];

    constructor() {
      this.round = 'preflop';
      this.pot = 0;
      this.limitOfPlayers = 10;
      this.players = [];
      this.deck = new Deck();
      this.roundCards = [];
      this.deck.shuffle();
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

        if (this.round === 'flop') {
            this.cards = [...this.deck.dealCards(3)];   
        } else if (this.round === 'turn') {
            this.cards= [...this.cards, ...this.deck.dealCards(1)];
        } else if (this.round === 'river') {
            this.cards = [...this.cards, ...this.deck.dealCards(1)];
        }
    }

    goToNextHand() {
        this.round = 'preflop';


        this.deck = new Deck();
        this.deck.shuffle();
        this.cards = [];

        this.players.forEach(player => {
            player.state = 'waiting';
            player.cards = this.deck.dealCards(2);
        });
    }

    isRiverRound() {
        return this.round === 'river';
    }

    hasPlayersWaiting() {
        return this.players.filter(p => p.state == 'waiting').length > 0;
    }
}
export default Game;