import User from "../models/users.model.js";

export class UserManager {
    createUser = async (user) => {
        try {
            const newUser = await User.create(user);
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
            const userExists = await User.findOne(user).lean();
            return userExists;    
        } catch (error) {
            console.log(`Error al verificar el usuario: ${error.message}`);
            return false;
        }
    }

}