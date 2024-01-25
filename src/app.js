import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routerProd from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerHome from './routes/home.routes.js'
import routerRealTimeProducts from './routes/realTimeProducts.routes.js'
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import { createServer } from 'node:http';

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

// Routes

app.use('/api/products', routerProd)
app.use('/api/carts', routerCarts)
app.use('/api/home', routerHome)
app.use('/api/realTimeProducts', routerRealTimeProducts)

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
})

export {io};