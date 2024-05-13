import Messages from "../models/messages.model.js";

export class MessagesManager {

    addMessage = async (data) => {
        const newMessage = new Messages({ user: { email: data.email }, message: data.message });
        await newMessage.save();
    }

    getMessages = () => {
        return Messages.find({}).sort({ _id: -1 }).limit(10).lean();
    }

}

export default MessagesManager;