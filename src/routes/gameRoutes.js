const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

router.get('/deal/:cardType', gameController.dealCards);

module.exports = router;
