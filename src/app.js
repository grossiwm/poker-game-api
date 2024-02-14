const express = require('express');
const gameRoutes = require('./routes/gameRoutes.js');

const app = express();

app.use(express.json());
app.use('/game', gameRoutes);

module.exports = app;
