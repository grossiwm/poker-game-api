
import { Server } from 'socket.io';
import app from './app.js';
import setupGameSockets from './sockets/gameSockets.js';
import http from 'http'

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
