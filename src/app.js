import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routerChat from './routes/chat.routes.js'
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import { createServer } from 'node:http';
import Database  from './db/index.js';
import routerProducts  from './routes/products.routes.js';
import routerCarts  from './routes/carts.routes.js';


let messages = [];

const PORT = 8080 || process.env.PORT;
const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta estatica
app.use(express.static(__dirname + '/public'));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


//  MongoDB Routes

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

// Chat Routes
app.use('/chat', routerChat);

// Socket.io

const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Chat
    socket.on('newMessage', (data) => {
        messages.push(data);
        io.sockets.emit('chatMessage', messages);
    })
})


server.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
    Database.connect();
})

export {io};