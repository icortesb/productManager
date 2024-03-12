import User from "../models/users.model.js";
import { createHash } from "../../utils/bcrypt.js";
import { CartManager } from "./cartsManager.js";


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
            console.log(`Error al crear el usuario: ${error.message}`);
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
            const userExists = await User.findOne(user.username).lean();
            return userExists;    
        } catch (error) {
            console.log(`Error al verificar el usuario: ${error.message}`);
            return false;
        }
    }

    async getUserPassword(user) {
        try {
            const user = await User.findOne(user).lean();
            return user.password;
        } catch(err) {
            console.log(`Error al buscar el usuario: ${err.message}`);
            return false;
        }
    }

}