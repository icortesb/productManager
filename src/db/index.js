import mongoose from "mongoose";

export const connect = () => {
    return mongoose.connect("mongodb+srv://ivancb97:Soz47261@proyectocoder.b5qrsdk.mongodb.net/ecommerce")
    .then(() => {
        console.log("BBDD conectada")
    })
    .catch((err) => {
        console.log(`Error al conector ${err.message}`)
    })
}