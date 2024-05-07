import { Router } from "express";
import passport from 'passport';

const routerSessions = new Router();

routerSessions.get('/github', passport.authenticate('github', {}), (req, res) => {})
routerSessions.get('/callbackGithub', passport.authenticate('github', {}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})

export default routerSessions;

