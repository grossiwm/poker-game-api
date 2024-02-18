export const dealCards = (req, res) => {
    const { cardType } = req.params;

    switch (cardType) {
      case 'flop':
        // Emitir o flop
        io.emit('flop', { /* dados do flop */ });
        break;
      case 'turn':
        // Emitir o turn
        io.emit('turn', { /* dados do turn */ });
        break;
      case 'river':
        // Emitir o river
        io.emit('river', { /* dados do river */ });
        break;
      default:
        res.status(400).send('Tipo de carta inválido');
        return;
    }
  
    res.send(`Emitido ${cardType}`);
};
