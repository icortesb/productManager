import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: {
                        type: Number,
                        default: 1
                    }
                }
            ],
        }
    },
    {versionKey: false}
)

CartSchema.pre(['find', 'findOne', 'findById'], function(next) {
    this.populate('products.product');
    next();
});


const Cart = mongoose.model('carts', CartSchema, 'carts')

export default Cart