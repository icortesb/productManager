import { Router } from "express";
import passport from "passport";
import generateJWT from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { UserManager } from "../controllers/userManager.js";
import { isValidPassword } from "../utils/bcrypt.js";
import router from "./index.routes.js";

const userManager = new UserManager();

const routerAuth = Router();

routerAuth.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedRegister',
}), (req, res) => {
    res.redirect('/login');
})


routerAuth.post('/login', async (req, res)  => {
    const { user, password } = req.body;

    if (user === 'adminCoder@coder.com' || password === 'adminCod3r123') {
        const token = jwt.sign({user: 'adminCoder@coder.com', role: 'admin'}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true });
        
        return res.redirect('/products');
    }
    try {
        const userExists = await userManager.getUser(user);

        if (!userExists || !await isValidPassword(password, userExists.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateJWT({user: userExists.user, role: userExists.role});

        res.cookie('jwt', token, { httpOnly: true });
        return res.redirect('/products');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


routerAuth.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    req.session.destroy();
    res.redirect('/login');
})

routerAuth.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    console.log('req.user:', req.user)
    const user = {
        user: req.user[0].user,
        role: req.user[0].role,
        cart: req.user[0].cart
    }
    res.status(200).json(user);
});


export default routerAuth;