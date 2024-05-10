import mongoose from "mongoose";
import uuid from "uuid";

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            default: () => uuid.v4()
        },
        purchase_datetime: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true
        },
        purchaser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    },
    {versionKey: false}
);

const Ticket = mongoose.model('ticket', ticketSchema, 'tickets');

export default Ticket;