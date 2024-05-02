import express from 'express';
import __dirname from './utils/dirname.js';
import routerChat from './routes/chat.routes.js'
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import { createServer } from 'node:http';
import Database  from './db/index.js';
import routerProducts  from './routes/products.routes.js';
import routerCarts  from './routes/carts.routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import routerViews from './routes/views.routes.js';
import routerAuth from './routes/auth.routes.js';
import routerSessions from './routes/sessions.routes.js';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import customRoute from './routes/customRoute.js';
import { Command } from 'commander';
import dotenv from 'dotenv';
// import { fork } from 'node:child_process';

const program = new Command();
program
.option('-p, --port <number>', 'Puerto del servidor', 8080)
.option('-dev, --dev', 'Modo desarrollo', false);

program.parse();

const enviroment = program.opts().dev ? 'dev' : 'prod';
console.log(`Modo ${enviroment}`);

dotenv.config({
    path: `${__dirname}/.env`
});

console.log(`Usando el .env de ${enviroment}`);


const PORT = enviroment === 'dev' ? process.env.PORT_DEV : process.env.PORT_PROD;
const app = express();
const server = createServer(app);
const customRouter = new customRoute();
app.use('/test', customRouter.getRouter());

// Passport
initializePassport();
app.use(passport.initialize());

// Session
app.use(session({
    store: MongoStore.create({mongoUrl: `mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/ecommerce`}),
    secret: 'codersecret',
    resave: true,
    saveUninitialized: true
}))

// Middlewares

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Views
app.use('/api/sessions', routerSessions);
app.use('/', routerViews);

// Auth
app.use('/auth', routerAuth);

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