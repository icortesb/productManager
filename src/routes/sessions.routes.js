import { Router } from "express";
import passport from 'passport';
import { CartManager } from "../controllers/cartsManager.js";

const cartManager = new CartManager();

const routerSessions = new Router();

routerSessions.get('/github', passport.authenticate('github', {}), (req, res) => {})
routerSessions.get('/callbackGithub', passport.authenticate('github', {}), async (req, res) => {


    req.session.user = req.user;
    req.session.user.role = 'user';
    let cart = await cartManager.newCart();
    cart = cart._id;
    req.session.user.cart = cart

    res.setHeader('Content-Type', 'application/json');
    // return res.status(200).json({payload: req.session, status: 'success'})
    return res.redirect('/products');

})

routerSessions.get('/current', passport.authenticate('current', {session: false}), (req, res) => {
    res.send(req.user);
})


export default routerSessions;