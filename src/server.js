const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const setupGameSockets = require('./sockets/gameSockets');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

setupGameSockets(io);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
