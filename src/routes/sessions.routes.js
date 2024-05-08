import { Router } from "express";
import passport from 'passport';
import generateJWT from '../utils/jwt.js';

const routerSessions = new Router();

routerSessions.get('/github', passport.authenticate('github', {}), (req, res) => {})
routerSessions.get('/callbackGithub', passport.authenticate('github', {}), async (req, res) => {
    const token = generateJWT({
        user: req.user.user,
        role: req.user.role,
        cart: req.user.cart
    });
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/products');
})

export default routerSessions;

