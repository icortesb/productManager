import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['Monitores', 'Periféricos', 'Procesadores',"Memorias RAM", "Almacenamiento", "Placas de video", "Laptops"],
            index: true
        },
        price: {
            type: Number,
            required: true
        },
        thumbnails: {
            type: Array,
            required: false
        },
        code: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            default: 10
        },
        status: {
            type: Boolean,
            default: true
        },
        // owner: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'users',
        //     default: 'admin'
        // }
    }
)

ProductSchema.plugin(paginate);

const Product = mongoose.model('products', ProductSchema, 'products')

export default Product