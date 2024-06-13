import { Router } from "express";
import { sendCartView, sendLoginView, sendProductsView, sendProfileView, sendRegisterView, sendTicketView, sendResetPasswordView} from "../services/views.service.js";
import { authRole, verifyLogin } from "../middleware/auth.js";
const routerViews = Router();


routerViews.get('/', (req, res) => {
    res.redirect('/login');
})

routerViews.get('/login', sendLoginView);
routerViews.get('/products',verifyLogin, sendProductsView);
routerViews.get('/carts/:cid',verifyLogin, sendCartView);
routerViews.get('/register', sendRegisterView);
routerViews.get('/profile', authRole('usuario'), sendProfileView);
routerViews.get('/ticket/:cid', sendTicketView);
routerViews.get('/resetPassword', sendResetPasswordView);

export default routerViews;