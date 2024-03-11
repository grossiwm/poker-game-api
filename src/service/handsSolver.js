import pockersolver from 'pokersolver';

const Hand = pockersolver.Hand;

const convertCards = (cards) => {

    function cardToCardDtoConverter(card) {

        function suitConverter(suitName) {
            
            switch (suitName) {
                case 'Hearts':
                    return 'h'
                case 'Diamonds':
                    return 'd';
                case 'Clubs':
                    return 'c';
                case 'Spades':
                    return 's'
                default:
                    throw new Error("No matching suit");
            }
        }
    
        function valueConverter(valueName) {
            
            switch (valueName) {
                case '10':
                    return 'T'
                default:
                    return valueName;
            }
        }
        
        const suitSymbol = suitConverter(card.suit);
        const valueSymbol = valueConverter(card.value);
    
        return valueSymbol.concat(suitSymbol);
    }

    return cards.map(c => cardToCardDtoConverter(c));
}

const getWinner = (players, communityCards) => {
    const convertedCommunityCards = convertCards(communityCards);
    const playersHands = new Map();
    
    for (let i = 0; i < players.length; i++) {
        playersHands.set(players[i], 
            getFinalPlayerHand(convertCards(players[i].cards), convertedCommunityCards))[0]
    }
    let bestHand = null;
    let bestPlayer;
    playersHands.forEach((hand, player) => {
        if (bestHand === null || hand.rank > bestHand.rank) {
            bestHand = hand;
            bestPlayer = player;
        }
    })
    return bestPlayer;

}



const getFinalPlayerHand = (playerCards, communityCards) => {
    const hands = getAllPossiblePlayerHands(playerCards, communityCards);
    return getBestHand(hands);
}

const getAllPossiblePlayerHands = (playerCards, communityCards) => {
    const cards = playerCards.concat(communityCards);
    let combinations = [];

    function generateCombo(start, combo) {
        if (combo.length == 5) {
            combinations.push(combo);
            return;
        }
        for (let i = start; i < cards.length; i++) {
            generateCombo(i + 1, combo.concat(cards[i]));
        }
    }

    generateCombo(0, []);
    return combinations;

}

const getBestHand = (hands) => {

    let bestHand = hands[0];

    for (let i = 1; i < hands.length; i++) {
        
        bestHand = Hand.winners([Hand.solve(bestHand), Hand.solve(hands[i])]);
    }
    return bestHand;

}

export default getWinner;