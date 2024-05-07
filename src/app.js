import express from 'express';
import __dirname from './utils/dirname.js';
import router from './routes/index.routes.js';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import { METHODS, createServer } from 'node:http';
import Database from './dao/mongo/db/db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import { Command } from 'commander';
import dotenv from 'dotenv';
import cors from 'cors';
// import customRoute from './routes/customRoute.js';
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

// CORS
const corsOptions = {
    origin: 'http://localhost:8080',
    METHODS: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// Passport
initializePassport();
app.use(passport.initialize());
// app.use(passport.session()); Comentado porque sino no funciona
// Session

app.use(session({
    // store: new FileStoreSession({path: './sessions', ttl: 10}),
    store: MongoStore.create({mongoUrl: `mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/ecommerce`}),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Middlewares

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Carpeta estatica
app.use(express.static(__dirname + '/public'));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Routes
app.use('/', router);

// Socket.io
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Usuario conectado al chat');

    // Chat
    socket.on('newMessage', (data) => {
        messages.push(data);
        io.sockets.emit('chatMessage', messages);
    })
})


server.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
    Database.getInstance();
})

export {io};