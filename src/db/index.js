import mongoose from "mongoose";

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