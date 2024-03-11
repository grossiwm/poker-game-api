import Deck from './Deck.js';
import Player from './Player.js';
import getWinner from '../service/handsSolver.js';

class Game {
    static gameRounds = ['preflop', 'flop', 'turn', 'river'];

    constructor() {
      this.round = 'preflop';
      this.pot = 0;
      this.limitOfPlayers = 10;
      this.players = [];
      this.deck = new Deck();
      this.cards = [];
      this.deck.shuffle();
      this.positionPlaying = 0;

      this.players.push(this.getDealer());
    }

    getDealer() {
        const dealer = new Player('dealer', 'Dealer');
        dealer.state = 'not_playing';
        dealer.isDealer = true;
        dealer.chips = null;
        return dealer;
    }

    getActivePlayers() {
        return this.players.filter(p => p.state !== 'not_playing');
    }

    receivePlayerBet(player, amount) {
        player.chips -= amount;
        this.pot += amount;

        this.goToNextPlayer();
    }

    getPositionPlaying() {
        return this.positionPlaying + 1;
    }

    goToNextPlayer() {
        this.positionPlaying = (this.positionPlaying+1)%(this.players.length-1);
    }

    playerCanPlay(player) {
        const playersFound = this.players.filter(p => player.id == p.id);
        if (playersFound.length > 0) {
            const playerFound = playersFound[0];
            return this.getPositionPlaying() === playerFound.position;
        } else {
            return false;
        }
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
            if (player.id === 'dealer') {
                return;
            }
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
    
    finishHand() {
        const player = getWinner(this.getActivePlayers(), this.cards);
        this.players.filter(p => p.id === player.id)[0].chips += this.pot;
        this.pot = 0;
        return player;
    }

    goToNextHand() {
        this.round = 'preflop';


        this.deck = new Deck();
        this.deck.shuffle();
        this.cards = [];

        this.players.forEach(player => {
            if (player.id === 'dealer') {
                return;
            }
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