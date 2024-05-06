import { Router } from "express";
import passport from 'passport';
import { CartManager } from "../controllers/cartManager.js";

const cartManager = new CartManager();

const routerSessions = new Router();

routerSessions.get('/github', passport.authenticate('github', {}), (req, res) => {})
routerSessions.get('/callbackGithub', passport.authenticate('github', {}), cartManager.newGitHubCart);


export default routerSessions;