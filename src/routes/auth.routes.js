import { Router } from "express";
import passport from "passport";
import { UserManager } from "../controllers/userManager.js";

const userManager = new UserManager();

const routerAuth = Router();

routerAuth.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedRegister',
}), (req, res) => {
    res.redirect('/login');
})


routerAuth.post('/login', function(req, res, next) {

    if (req.body.user === 'adminCoder@coder.com' || req.body.password === 'adminCod3r123') {
        req.session.user = req.body;
        req.session.user.role = 'admin';
        req.session.user.cart = '65e79b297bdc4ccc194cbc5d'
        
        return res.redirect('/products');
    }
    passport.authenticate('login', function(err, user) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.redirect('/failedLogin'); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            req.session.user = userManager.getUser(req.body.user);
            req.session.user.role = 'user';
            req.session.user.cart = user.cart;
            return res.redirect('/products');
        });
    })(req, res, next);
});


routerAuth.get('/logout', (req, res) => {
    req.session.destroy(err => {
        err ? res.json({err}) : res.redirect('/login');
    })
})


routerAuth.get('/user', (req, res) => {
    res.json(req.session.user)
})


export default routerAuth;