import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
    {
        user: {
            email: {
                type: String,
                required: true,
                trim: true
            }
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {versionKey: false}
    )

const Messages = mongoose.model('messages', messagesSchema)

export default Messages