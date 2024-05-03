import { Router } from "express";
import { ProductManager } from "../dao/mongoManagers/productManager.js";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";
import { authAdmin } from "../middleware/auth.js";
import { sendCartView, sendLoginView, sendProductsView, sendProfileView, sendRegisterView } from "../services/viewsService.service.js";

const routerViews = Router();
const PM = new ProductManager();
const userManager = new UserManager();
const CM = new CartManager();

function auth(req, res, next) {
    if(req.session.user) {
        next()
    } else {
        res.status(403).redirect('/login')
    }
}

routerViews.get('/', (req, res) => {
    res.redirect('/login');
})

routerViews.get('/login', sendLoginView);
routerViews.get('/products', auth, sendProductsView);
routerViews.get('/carts/:cid', auth, sendCartView);
routerViews.get('/register', sendRegisterView);
routerViews.get('/profile', authAdmin, sendProfileView);

export default routerViews;