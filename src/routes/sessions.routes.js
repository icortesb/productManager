import { Router } from "express";
import passport from 'passport';
import { CartManager } from "../dao/mongoManagers/cartsManager.js";

const cartManager = new CartManager();

const routerSessions = new Router();

routerSessions.get('/github', passport.authenticate('github', {}), (req, res) => {})
routerSessions.get('/callbackGithub', passport.authenticate('github', {}), (req, res) => {


    req.session.user = req.user;
    req.session.user.role = 'user';
    req.session.user.cart = cartManager.createCart(req.user._id);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload: req.session.user, status: 'success'})

})


export default routerSessions;