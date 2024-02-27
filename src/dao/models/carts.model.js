import mongoose, { version } from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        // products: {
        //     type: Array,
        //     required: true
            
        // }
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    }
                }
            ]
        }
    },
    {versionKey: false}
)

CartSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});


const Cart = mongoose.model('carts', CartSchema, 'carts')

export default Cart