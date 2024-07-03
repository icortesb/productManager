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
            default: 'usuario',
            enum: ['usuario', 'admin', 'premium']
        },
        cart: {
            type: String,
            default: ''
        },
        documents:  {
            type: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    type: {
                        type: String,
                        required: true
                    }
                }
            ]
                    
        },
        lastConnection: {
            type: Date,
            default: Date.now
        }
    }
    ,{
        strict: false
    }
)

const User = mongoose.model('users', userSchema, 'users')

export default User