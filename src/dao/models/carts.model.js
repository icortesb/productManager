import mongoose, { version } from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        products: {
            type: Array,
            required: true
        }
    },
    {versionKey: false}
)

const Cart = mongoose.model('carts', CartSchema)

export default Cart