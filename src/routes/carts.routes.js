import { Router } from "express";
import { CartManager } from "../dao/mongo/controllers/cartManager.js";
import passport from "passport";

const routerCarts = Router();
const cartManager = new CartManager('./src/models/carts.json');

routerCarts.get('/:cid', cartManager.getCartById);
routerCarts.post('/', cartManager.newCart);
routerCarts.post('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), cartManager.addProductToCart);
routerCarts.delete('/:cid/products/:pid', cartManager.deleteProductFromCart);
routerCarts.put('/:cid', cartManager.updateCart);
routerCarts.put('/:cid/products/:pid', cartManager.updateProductQuantity);
routerCarts.delete('/:cid', cartManager.deleteAllProducts);
routerCarts.get('/:cid/purchase', cartManager.purchaseCart);

export default routerCarts;