import { Router } from "express";
import { authAdmin } from "../middleware/auth.js";
import { sendCartView, sendLoginView, sendProductsView, sendProfileView, sendRegisterView } from "../services/viewsService.service.js";
import { verifyJWT } from "../utils/jwt.js";

const routerViews = Router();

const verifyLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token && !req.session.user) {
        return res.redirect('/login');
    }
    const session = req.session;
    if (session.user) {
        req.user = session.user;
        return next();
    }
    try {
        const decodedToken = verifyJWT(token);
        console.log(`Decoded token: ${JSON.stringify(decodedToken)}`)
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}

routerViews.get('/', (req, res) => {
    res.redirect('/login');
})

routerViews.get('/login', sendLoginView);
routerViews.get('/products',verifyLogin, sendProductsView);
routerViews.get('/carts/:cid',verifyLogin, sendCartView);
routerViews.get('/register', sendRegisterView);
routerViews.get('/profile', authAdmin, sendProfileView);

export default routerViews;