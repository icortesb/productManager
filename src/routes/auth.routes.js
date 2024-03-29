import { Router } from "express";
import { UserManager } from "../dao/mongoManagers/usersManager.js";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";
import { isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";
import generateJWT from "../utils/jwt.js";
import jwt from "jsonwebtoken";


const routerAuth = Router();
const userManager = new UserManager();

routerAuth.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedRegister',
}), (req, res) => {
    res.redirect('/login');
})

routerAuth.post('/login', async (req, res) => {
    const { user, password } = req.body;

    if (user === 'adminCoder@coder.com' || password === 'adminCod3r123') {
        const token = jwt.sign({user: 'adminCoder@coder.com', role: 'admin'}, 'Coder123', { expiresIn: '1h' });
        res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
        return res.redirect('/products');
    }

    try {
        const userExists = await userManager.getUser(user);

        if (!userExists || !await isValidPassword(password, userExists.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateJWT({user: userExists.user, role: userExists.role});

        res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
        return res.redirect('/products');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


routerAuth.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
})


routerAuth.get('/user', (req, res) => {
    res.json(req.session.user)
})


export default routerAuth;