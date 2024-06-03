import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:8080',
    METHODS: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

export default function configureCors() {
    return cors(corsOptions);
}