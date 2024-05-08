import { Router } from "express";
import { CartManager } from "../controllers/cartManager.js";
import { authRole } from "../middleware/auth.js";

const routerCarts = Router();
const cartManager = new CartManager('./src/models/carts.json');

routerCarts.get('/:cid', cartManager.getCartById);
routerCarts.post('/', cartManager.newCart);
routerCarts.post('/:cid/products/:pid', authRole('usuario'), cartManager.addProductToCart);
routerCarts.delete('/:cid/products/:pid', cartManager.deleteProductFromCart);
routerCarts.put('/:cid', cartManager.updateCart);
routerCarts.put('/:cid/products/:pid', cartManager.updateProductQuantity);
routerCarts.delete('/:cid', cartManager.deleteAllProducts);

export default routerCarts;