import { Router } from "express";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";
import { isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";

const routerAuth = Router();
const userManager = new UserManager();
const cartManager = new CartManager();

// routerAuth.post('/register', async (req, res) => {
//     let newUser = req.body;

//     const user = await userManager.createUser(newUser);
    
//     const newCart = await cartManager.newCart();
//     user.cart = newCart._id;
//     await user.save();

//     res.redirect('/login');
// })

routerAuth.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedRegister',
}), (req, res) => {
    res.redirect('/login');
})


routerAuth.post('/login', async (req, res) => {
    const user = req.body;
    const userExists = await userManager.getUser(user);
    
    if (user.user === 'adminCoder@coder.com' || user.password === 'adminCod3r123') {
        req.session.user = user;
        req.session.user.role = 'admin';
        req.session.user.cart = '65e79b297bdc4ccc194cbc5d'
        
        res.redirect('/products');
    } else {
        const isValid = await isValidPassword(user, userExists.password);
        console.log(`User: ${user}, UserExists: ${userExists}`)
        
        if(isValid) {
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

// routerAuth.post('/login', passport.authenticate('login', {
//     failureRedirect: '/failedLogin',
// }), (req, res) => {
//     res.redirect('/products');
// })


routerAuth.get('/logout', (req, res) => {
    req.session.destroy(err => {
        err ? res.json({err}) : res.redirect('/login');
    })
})


routerAuth.get('/user', (req, res) => {
    res.json(req.session.user)
})


export default routerAuth;