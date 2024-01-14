import express from 'express';
import routerProd from './routes/products.routes.js'

const PORT = 8080;
const app = express();

// Middlewares
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes

app.use('/api/products', routerProd)

app.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
})