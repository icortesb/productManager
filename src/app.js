import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routerProd from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerHome from './routes/home.routes.js'
import { engine } from 'express-handlebars';

const PORT = 8080;
const app = express();
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

app.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
})