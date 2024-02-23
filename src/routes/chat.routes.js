import { Router } from "express";
import Messages from "../dao/models/messages.model.js";

const routerChat = Router();

routerChat.get('/', (req, res) => {
    res.render('chat', {})
})

routerChat.post('/', async (req, res) => {
    const { email, message } = req.body;
    const newMessage = new Messages({ user: { email }, message });
    await newMessage.save();
    res.status(200).json({ message: 'Mensaje guardado' });
})

export default routerChat;