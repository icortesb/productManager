import { Router } from "express";
import User from "../dao/mongo/models/users.model.js";
import Cart from "../dao/mongo/models/carts.model.js";

const routerAdmin = Router();

routerAdmin.delete('/deleteCarts', async (req, res) => {
    try {
        const result = await Cart.deleteMany({});
        res.status(200).send({
            message: 'All carts deleted',
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

routerAdmin.delete('/deleteUsers', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).send({
            message: 'All users deleted',
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

export default routerAdmin;