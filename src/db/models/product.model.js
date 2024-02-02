import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        category: {
            type: String,
            require: true,
            enum: ['Monitores', 'Periféricos', 'Procesadores',"Memorias RAM", "Almacenamiento", "Placas de video", "Laptops"]  
        },
        stock: {
            type: Number,
            default: 10
        }
    }
)

const Product = mongoose.model('products', ProductSchema)

export default Product