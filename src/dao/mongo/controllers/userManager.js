import User from "../models/users.model.js";
import { createHash } from "../../../utils/bcrypt.js";
import { CartManager } from "./cartManager.js";
import { isValidPassword } from "../../../utils/bcrypt.js";
import generateJWT from "../../../utils/jwt.js";
import CustomError from "../../../services/errors/CustomError.js";
import errors from "../../../services/errors/enums.js";
import { generateUserErrorInfoSP } from "../../../services/errors/messages/userErrorInfo.js";


const cartManager = new CartManager();
export class UserManager {

    createUser = async (user) => {
        try {
            const newUser = await User.create(user);
            newUser.password = await createHash(newUser.password);
            const newCart = await cartManager.newCart();
            newUser.cart = newCart._id;
            await newUser.save();  
            return newUser;
        } catch (error) {
            CustomError.createError ({
                name: "User creation Error",
                cause: generateUserErrorInfoSP({ user }),
                message: "Error tratando de crear el usuario",
                code: errors.INVALID_TYPES_ERROR
            });

            return false;
        }
    }

    getAllUsers = async () => {
        try {
            const users = await User.find().lean();
            return users;
        } catch (error) {
            console.log(`Error al leer los usuarios: ${error.message}`);
        }
    }

    async getUser(user) {
        try {
            const userExists = await User.findOne({user: user}).lean();
            return userExists;    
        } catch (error) {
            console.log(`Error al verificar el usuario: ${error.message}`);
            return false;
        }
    }

    async loginUser(req, res) {
        const { user, password } = req.body;
        if (user === 'adminCoder@coder.com' || password === 'adminCod3r123') {
            const token = generateJWT({
                user: 'adminCoder@coder.com',
                role: 'admin'
            });
            res.cookie('jwt', token, { httpOnly: true });
            
            return res.redirect('/products');
        }
        try {
            const userExists = await User.findOne({ user: user }).lean();    
            if (!userExists || !await isValidPassword(password, userExists.password)) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
    
            const token = generateJWT({user: userExists.user, role: userExists.role, cart: userExists.cart});
    
            res.cookie('jwt', token, { httpOnly: true });
            return res.redirect('/products');
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logoutUser(req, res) {
        res.clearCookie('jwt');
        res.redirect('/login');
    }

    async getCurrentUser(req, res) {
        const user = {
            user: req.user[0].user,
            role: req.user[0].role,
            cart: req.user[0].cart
        };
        res.status(200).json(user);
    }

    async resetPassword(req, res) {
        const { email } = req.body;
        try {
            const userExists = await User.findOne({ user: email });
            if (!userExists) {
                return res.status(400).json({ message: 'User not found' });
            }
            return res.redirect(`/mail/resetPassword/${email}`);

            
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async newPassword(req, res) {
        const { mail, password } = req.body;
        try {
            const userExists = await
            User.findOne({ user: mail });
            if (!userExists) {
                return res.status(400).json({ message: 'User not found' });
            }
            if (await isValidPassword(password, userExists.password)) {
                return res.status(400).json({ message: 'Password is the same' });
            }
            userExists.password = await createHash(password);
            await userExists.save();
            return res.redirect('/login');
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}