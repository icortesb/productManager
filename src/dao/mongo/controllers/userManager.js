import User from "../models/users.model.js";
import { createHash } from "../../../utils/bcrypt.js";
import { CartManager } from "./cartManager.js";
import { isValidPassword } from "../../../utils/bcrypt.js";
import generateJWT from "../../../utils/jwt.js";
import CustomError from "../../../services/errors/CustomError.js";
import errors from "../../../services/errors/enums.js";
import { generateUserErrorInfoSP } from "../../../services/errors/messages/userErrorInfo.js";
import { verifyJWT } from "../../../utils/jwt.js";


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
            return users.map(user => {
                return {
                    _id: user._id,
                    user: user.user,
                    role: user.role,
                };
            });

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
            const userExists = await User.findOne({ user: user });    
            if (!userExists || !await isValidPassword(password, userExists.password)) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            userExists.lastConnection = new Date();
            await userExists.save();
            console.log(`User ${user} logged in with last connection ${userExists.lastConnection}`)
    
            const token = generateJWT({user: userExists.user, role: userExists.role, cart: userExists.cart});
    
            res.cookie('jwt', token, { httpOnly: true });
            return res.redirect('/products');
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logoutUser(req, res) {
        const token = req.cookies['jwt'];
        const decodedToken = verifyJWT(token);
        const user = decodedToken.user;
        const userExists = await User.findOne({ user: user });
        userExists.lastConnection = new Date();
        await userExists.save();
        console.log(`User ${user} logged out with last connection ${userExists.lastConnection}`);
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

    getUserRoles = async () => {
        try {
            const roles = User.schema.path('role').enumValues;
            return roles.sort();
        } catch (error) {
            console.log(`Error al leer los roles: ${error.message}`);
            return [];
        }
    }

    changeUserRole = async (user, role) => {
        try {
            const userExists = await User.findById(user);
            if (!userExists) {
                return false;
            }
            userExists.role = role;
            await userExists.save();
            return true;
        } catch (error) {
            console.log(`Error al cambiar el rol: ${error.message}`);
            return false;
        }
    }

    getUserId = async (user) => {
        try {
            const userExists = await User.findOne({ user: user }).lean();
            return userExists._id;
        } catch (error) {
            console.log(`Error al verificar el usuario: ${error.message}`);
            return false;
        }
    }

    deleteUser = async (id) => {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.log(`Error al eliminar el usuario: ${error.message}`);
            return false;
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            const users = await User.find({ lastConnection: { $lt: new Date(Date.now() - 172800000) } });
            if (users.length === 0) {
                console.log('No hay usuarios inactivos');
                return res.status(404).json({ message: 'No hay usuarios inactivos' });
            }
            users.forEach(async user => {
                const mail = user.user;
                this.deleteUser(user._id);
                console.log(`Usuario ${mail} eliminado por inactividad`);
                return res.redirect(`/mail/deletedUser/${mail}`);
            })
        } catch (error) {
            console.log(`Error al eliminar los usuarios inactivos: ${error.message}`);
        }
    }
}