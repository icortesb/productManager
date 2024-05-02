import { Router } from "express";
import { CartManager } from "../controllers/cartsManager.js";
import router from "./index.routes.js";

const routerCarts = Router();
const cartManager = new CartManager('./src/models/carts.json');

routerCarts.get('/:cid', cartManager.getCartById);
routerCarts.post('/', cartManager.newCart);
routerCarts.post('/:cid/products/:pid', cartManager.addProductToCart);
routerCarts.delete('/:cid/products/:pid', cartManager.deleteProductFromCart);
routerCarts.put('/:cid', cartManager.updateCart);
routerCarts.put('/:cid/products/:pid', cartManager.updateProductQuantity);
routerCarts.delete('/:cid', cartManager.deleteAllProducts);

export default routerCarts;