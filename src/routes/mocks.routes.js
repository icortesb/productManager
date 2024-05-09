import { Router } from "express";
import { generateUser } from "../mocks/users.mocks.js";

const routerMocks = Router();

routerMocks.get('/users', (req, res) => {
    const users = [];
    for (let i = 0; i < 50; i++) {
        users.push(generateUser());
    }
    res.status(201).json(users);
})

export default routerMocks;