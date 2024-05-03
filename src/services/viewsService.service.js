import { findCartByIdLean } from "./cartService.service.js";
import { findProducts } from "./productsService.service.js";

export const sendLoginView = (req, res) => {
    res.render('login', {})
}

export const sendProductsView = async (req, res) => {
    try {
        const products = await findProducts();
        const user = req.session.user;
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

export const sendProfileView = (req, res) => {
    const user = req.session.user;
    res.render('profile', {user})
}