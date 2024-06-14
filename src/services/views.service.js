import { findCartByIdLean } from "./carts.service.js";
import { findProducts } from "./products.service.js";
import { UserManager } from "../dao/mongo/controllers/userManager.js";
import { ProductManager } from "../dao/mongo/controllers/productManager.js";
import { verifyJWT } from "../utils/jwt.js";
const userManager = new UserManager();
const productManager = new ProductManager();

export const sendLoginView = (req, res) => {
    res.render('login', {})
}

export const sendProductsView = async (req, res) => {
    try {
        const products = await findProducts();
        const token = req.cookies.jwt;
        let user = null;
        if (token) {
            const decodedToken = verifyJWT(token);
            user = await userManager.getUser(decodedToken.user);
        } else {
            user = req.session.user;
        }
        res.render('products', { products, user });
    } catch (error) {
        res.json({error: error.message})        
    }
}

export const sendCartView = async (req, res) => {
    try {
        const { cid } = req.params;
        let cart = await findCartByIdLean(cid);
        
        res.render('cart', { cart });
    } catch (error) {
        res.json({error: error.message})        
    }
}

export const sendRegisterView = (req, res) => {
    res.render('register', {})
}

export const sendProfileView = async (req, res) => {
    const token = req.cookies.jwt;
    let user = null;
    let cart = null;
    let products = null;
    let roles = null;
    if (token) {
        const decodedToken = verifyJWT(token);
        user = await userManager.getUser(decodedToken.user);
        cart = decodedToken.cart;
        products = await productManager.returnAllProducts();
        roles = await userManager.getUserRoles();
    } else {
        res.redirect('/login');
    }
    res.render('profile', {user, cart, products, roles});
}

export const sendTicketView = async (req, res) => {
    const { cid } = req.params;
    let cart = await findCartByIdLean(cid);
    console.log(cart)
    res.render('ticket', { cart });
}

export const sendResetPasswordView = (req, res) => {
    res.render('resetPassword', {})
}