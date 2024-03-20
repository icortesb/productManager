import { Router } from "express";
import { ProductManager } from "../dao/mongoManagers/productManager.js";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";
import passport from "passport";
import { auth } from "../middleware/auth.js";

const routerViews = Router();
const PM = new ProductManager();
const userManager = new UserManager();
const CM = new CartManager();

routerViews.get('/', (req, res) => {
    res.redirect('/login');
})

routerViews.get('/products', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), async (req, res) => {
    try {
        const products = await PM.getProducts();
        const user = await userManager.getUser(req.user.user) || req.user.user;
        
        res.render('products', { products, user});
    } catch (error) {
        res.json({error: error.message})        
    }
})

routerViews.get('/carts/:cid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CM.getCartById(cid);
        res.render('cart', { cart });
    } catch (error) {
        res.json({error: error.message})        
    }
})

routerViews.get('/login', (req, res) => {
    res.render('login', {})
})

routerViews.get('/register', (req, res) => {
    res.render('register', {})})

routerViews.get('/profile', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), auth, async (req, res) => {
    res.send('profile')
})

export default routerViews;