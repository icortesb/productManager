import mongoose from "mongoose";
import dotenv from 'dotenv';
import __dirname from '../utils/dirname.js';

dotenv.config({
    path: `${__dirname}/.env`
});


export default {
    connect: async () => {
        try {
            await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/ecommerce`);
            console.log('Conectado a la base de datos');

           
        } catch (error) {
            console.log(`Error al conectar a la base de datos: ${error}`);
        }
    }
}