import { Router } from "express";
import passport from "passport";
import { authRole, verifyLogin } from "../middleware/auth.js";

const routerChat = Router();

routerChat.get('/', verifyLogin, (req, res) => {
    res.render('chat', {})
})


routerChat.post('/', passport.authenticate('current', { session: false }), authRole('usuario'), async (req, res) => {
    res.status(200).json({ message: 'Mensaje guardado' });
})

export default routerChat;