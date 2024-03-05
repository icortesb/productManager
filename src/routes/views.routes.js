import { Router } from "express";
import { ProductManager } from "../dao/mongoManagers/productManager.js";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";

const routerViews = Router();
const PM = new ProductManager();
const userManager = new UserManager();
const CM = new CartManager();

function auth(req, res, next) {
    if(req.session.user) {
        next()
    } else {
        res.redirect('/view/login-view')
    }
}

routerViews.get('/products-view', auth, async (req, res) => {
    try {
        const products = await PM.getProducts();
        const user = req.session.user;
        res.render('products', { products, user });
    } catch (error) {
        res.json({error: error.message})        
    }
})

routerViews.get('/carts/:cid', auth, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CM.getCartById(cid);
        res.render('cart', { cart });
    } catch (error) {
        res.json({error: error.message})        
    }
})


routerViews.get('/login-view', (req, res) => {
    res.render('login', {})
})

routerViews.get('/register-view', (req, res) => {
    res.render('register', {})})

routerViews.get('/profile-view', auth, (req, res) => {
    res.render('profile', {})
})

export default routerViews;