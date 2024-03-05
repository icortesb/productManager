import mongoose from "mongoose";
import Cart from "../dao/models/carts.model.js"; // Solo para test
import Product from "../dao/models/product.model.js"; // Solo para test

export default {
    connect: async () => {
        try {
            await mongoose.connect("mongodb+srv://ivancb97:Soz47261@proyectocoder.iu36jco.mongodb.net/ecommerce");
            console.log('Conectado a la base de datos');

           
        } catch (error) {
            console.log(`Error al conectar a la base de datos: ${error}`);
        }
    }
}