import cors from 'cors';

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

export default function configureCors() {
    return cors(corsOptions);
}