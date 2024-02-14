exports.dealCards = (req, res) => {
    const { cardType } = req.params;

    switch (cardType) {
      case 'flop':
        // Emitir o flop
        io.emit('dealFlop', { /* dados do flop */ });
        break;
      case 'turn':
        // Emitir o turn
        io.emit('dealTurn', { /* dados do turn */ });
        break;
      case 'river':
        // Emitir o river
        io.emit('dealRiver', { /* dados do river */ });
        break;
      default:
        res.status(400).send('Tipo de carta inválido');
        return;
    }
  
    res.send(`Emitido ${cardType}`);
};
