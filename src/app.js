import express from "express";
import __dirname from "./utils/dirname.js";
import router from "./routes/index.routes.js";
import {engine} from "express-handlebars";
import {Server} from "socket.io";
import {createServer} from "node:http";
import Database from "./dao/mongo/db/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import {initializePassport} from "./config/passport.config.js";
import dotenv from "dotenv";
import MessagesManager from "./dao/mongo/controllers/messagesManager.js";
import compression from "express-compression";
// import customRoute from './routes/customRoute.js';
// import { fork } from 'node:child_process';
import {PORT} from "./config/commander.config.js";
import corsConfig from "./config/cors.config.js";
import cluster from "node:cluster";
import os from "node:os";
import e from "express";

// Cluster
if (cluster.isPrimary) {
    const numeroDeProcesadores = os.cpus().length;
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(
            `Worker ${
                worker.process.pid
            } died at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
        );
        cluster.fork();
    });
} else {
      dotenv.config({
        path: `${__dirname}/.env`,
    });

    const app = express();
    const server = createServer(app);

    // CORS
    app.use(corsConfig());

    // Gzip
    app.use(compression());

    // Passport
    initializePassport();
    app.use(passport.initialize());
    // app.use(passport.session()); Comentado porque sino no funciona

    // Session
    app.use(
        session({
            // store: new FileStoreSession({path: './sessions', ttl: 10}),
            store: MongoStore.create({
                mongoUrl: `mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/ecommerce`,
            }),
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
        })
    );

    // Middlewares
    app.use(express.text());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    // Carpeta estatica
    app.use(express.static(__dirname + "/public"));

    // Handlebars
    app.engine("handlebars", engine());
    app.set("view engine", "handlebars");
    app.set("views", __dirname + "/views");

    // Routes
    app.use("/", router);

    // Socket.io
    const messagesManager = new MessagesManager();
    const io = new Server(server);
    io.on("connection", (socket) => {
        console.log("Usuario conectado al chat");

        // Chat
        socket.on("newMessage", async (data) => {
            await messagesManager.addMessage(data);
            const messages = await messagesManager.getMessages();
            io.sockets.emit("chatMessage", messages);
        });
    });

    server.listen(PORT, () => {
        console.log(`Servidor arriba. Puerto ${PORT}`);
        Database.getInstance();
    });
}
