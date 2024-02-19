class Deck {
    constructor() {
      this.cards = this.createDeck();
      this.shuffle();
    }
  
    createDeck() {
      const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const deck = [];
  
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ suit, value });
        }
      }
  
      return deck;
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    dealCard() {
      return this.cards.pop();
    }
  
    dealCards(numCards) {
      return Array.from({ length: numCards }, () => this.dealCard());
    }
}

export default Deck;
  