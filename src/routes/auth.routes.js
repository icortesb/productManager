import { Router } from "express";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";

const routerAuth = Router();
const userManager = new UserManager();
const cartManager = new CartManager();

routerAuth.post('/register', async (req, res) => {
    let newUser = req.body;

    const user = await userManager.createUser(newUser);
    
    const newCart = await cartManager.newCart();
    user.cart = newCart._id;
    await user.save();


    res.redirect('/login');
})


routerAuth.post('/login', async (req, res) => {
    let user = req.body;

    if (user.user === 'adminCoder@coder.com' || user.password === 'adminCod3r123') {
        req.session.user = user;
        req.session.user.role = 'admin';
        req.session.user.cart = '65e79b297bdc4ccc194cbc5d'
        
        res.redirect('/products');
    } else {
        // Verificar si usuario en BBDD
        let userExists = await userManager.getUser(user);
        
        if(userExists) {
            req.session.user = user;
            req.session.user.role = 'user';
            req.session.user.cart = userExists.cart;
            console.log(req.session)
            res.redirect('/products');
        } else {
            res.status(401).json({error: 'Usuario o contraseña incorrectos'});
        }

    }

})


routerAuth.get('/logout', (req, res) => {
    req.session.destroy(err => {
        err ? res.json({err}) : res.redirect('/login');
    })
})


routerAuth.get('/user', (req, res) => {
    res.json(req.session.user)
})


export default routerAuth;