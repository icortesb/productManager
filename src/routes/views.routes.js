import { Router } from "express";
import { sendCartView, sendLoginView, sendProductsView, sendProfileView, sendRegisterView } from "../services/viewsService.service.js";
import { authAdmin, verifyLogin } from "../middleware/auth.js";
const routerViews = Router();


routerViews.get('/', (req, res) => {
    res.redirect('/login');
})

routerViews.get('/login', sendLoginView);
routerViews.get('/products',verifyLogin, sendProductsView);
routerViews.get('/carts/:cid',verifyLogin, sendCartView);
routerViews.get('/register', sendRegisterView);
routerViews.get('/profile', authAdmin, sendProfileView);

export default routerViews;