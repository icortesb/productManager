import e, { Router } from "express";

const routerCarts = Router();

routerCarts.get('/', (req, res) => {
    res.send('GET /api/carts')
})

export default routerCarts;