import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'usuario'
        },
        cart: {
            type: String,
            default: ''
        }
    }
)

const User = mongoose.model('users', userSchema, 'users')

export default User