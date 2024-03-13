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
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import FileStore from 'session-file-store';
// const FileStoreSession = FileStore(session);
import MongoStore from 'connect-mongo'
import routerViews from './routes/views.routes.js';
import routerAuth from './routes/auth.routes.js';
import routerSessions from './routes/sessions.routes.js';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';


const PORT = 8080 || process.env.PORT;
const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Passport
initializePassport();
app.use(passport.initialize());
// app.use(passport.session()); Comentado porque sino no funciona
// Session

app.use(session({
    // store: new FileStoreSession({path: './sessions', ttl: 10}),
    store: MongoStore.create({mongoUrl: 'mongodb+srv://ivancb97:Soz47261@proyectocoder.iu36jco.mongodb.net/ecommerce'}),
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
app.use('/', routerViews);
app.use('/api/sessions', routerSessions);

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