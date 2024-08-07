import {
    findCarts,
    findCartById,
    createCart,
    findCartAndUpdate,
} from "../../../services/carts.service.js";
import {findProductById} from "../../../services/products.service.js";
import { verifyJWT } from "../../../utils/jwt.js";
import User from "../models/users.model.js";



export class CartManager {
    getCarts = async () => {
        try {
            const carts = await findCarts();
            return carts;
        } catch (error) {
            console.error(`Error al obtener los carritos: ${error.message}`);
            return null;
        }
    };

    getCartById = async (req, res) => {
        const {cid} = req.params;
        const cart = await findCartById(cid);
        if (cart) {
            res.status(200).json({
                message: `Carrito encontrado`,
                cart: cart,
            });
        } else {
            res.status(404).json({
                message: `Carrito no encontrado`,
            });
        }
    };
    newCart = async () => {
        try {
            const cart = await createCart();
            return cart;
        } catch (error) {
            console.error(`Error al crear el carrito: ${error.message}`);
            return null;
        }
    };

    addProductToCart = async (req, res) => {
        const {cid, pid} = req.params;
        const token = req.cookies["jwt"];
        const decodedToken = verifyJWT(token);
        const userRole = decodedToken.role;

        if (userRole === "premium") {
            const product = await findProductById(pid);
            const userId = (await User.findOne({user: decodedToken.user}))._id;
            if (product.owner._id.toString() === userId.toString()) {
                res.sendFile("src/public/404.html", {root: "."});
                return;
            }
        }
        let cart = await findCartById(cid);
        const product = await findProductById(pid);
        if (!cart || !product) {
            res.status(404).json({
                message: `Carrito o producto no encontrado`,
            });
            return;
        } else {
            cart = await this.saveCartsById(cid, pid);
            res.redirect(`/carts/${cid}`);
        }
    };

    saveCartsById = async (cid, pid) => {
        try {
            const cart = await findCartById(cid);
            const productById = await findProductById(pid);
            if (!cart || !productById) {
                return false;
            }

            const productIndex = cart.products.findIndex(
                (prod) => prod.product.title === productById.title
            );
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({product: pid, quantity: 1});
            }
            await cart.save();
            const updatedCart = await findCartById(cid);
            updatedCart.populate("products.product");
            return updatedCart;
        } catch (error) {
            console.log(`Error al guardar el carrito: ${error.message}`);
            return false;
        }
    };

    deleteProductFromCart = async (req, res) => {
        const {cid, pid} = req.params;
        let cart = await findCartById(cid);
        const product = await findProductById(pid);
        if (!cart || !product) {
            res.status(404).json({
                message: `Carrito o producto no encontrado`,
            });
            return;
        } else {
            cart = await this.deleteProductById(cid, pid);
            return res.send(cart);
        }
    };

    deleteProductById = async (cid, pid) => {
        try {
            const cart = await findCartById(cid);
            const product = await findProductById(pid);

            const productIndex = cart.products.findIndex(
                (prod) => prod.product.title === product.title
            );
            if (productIndex !== -1) {
                if (cart.products[productIndex].quantity > 0) {
                    cart.products[productIndex].quantity--;
                    if (cart.products[productIndex].quantity === 0) {
                        cart.products = cart.products.filter(
                            (prod) => prod.product.title !== product.title
                        );
                    }
                    const updatedCart = await cart.save();
                    return updatedCart;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(
                `Error al eliminar el producto del carrito: ${error.message}`
            );
            return false;
        }
    };

    updateCart = async (req, res) => {
        const {cid} = req.params;
        const {products} = req.body;
        let cart = await findCartById(cid);
        if (!cart) {
            res.status(404).json({
                message: `Carrito no encontrado`,
            });
            return;
        } else {
            cart = await findCartAndUpdate(cid, products);
            await cart.save();
            res.status(200).json({
                message: `Carrito actualizado correctamente`,
                cart: cart,
            });
        }
    };

    updateProductQuantity = async (req, res) => {
        const {cid, pid} = req.params;
        const {quantity} = req.body;
        let cart = await findCartById(cid);
        let product = await findProductById(pid);
        if (!cart) {
            res.status(404).json({
                message: `Carrito no encontrado`,
            });
            return;
        } else {
            if (!quantity) {
                res.status(400).json({
                    message: `No se ha enviado la cantidad`,
                });
                return;
            }
            const productIndex = cart.products.findIndex(
                (prod) => prod.product.title === product.title
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                cart = await findCartAndUpdate(cid, cart.products);
                res.status(200).json({
                    message: `Producto actualizado correctamente`,
                    cart: cart,
                });
            } else {
                res.status(404).json({
                    message: `Producto no encontrado`,
                });
            }
        }
    };

    deleteAllProducts = async (req, res) => {
        const {cid} = req.params;
        let cart = await findCartById(cid);
        if (!cart) {
            res.status(404).json({
                message: `Carrito no encontrado`,
            });
            return;
        } else {
            cart = await findCartAndUpdate(cid, []);
            res.status(200).json({
                message: `Productos eliminados correctamente`,
                cart: cart,
            });
        }
    };

    purchaseCart = async (req, res) => {
        const {cid} = req.params;
        let cart = await findCartById(cid);
        const originalCart = await findCartById(cid);
        if (!cart) {
            res.status(404).json({
                message: `Carrito no encontrado`,
            });
            return;
        } else {
            for (const prod of cart.products) {
                const product = await findProductById(prod.product);
                if (product.stock < prod.quantity) {
                    console.log(
                        `No hay stock suficiente del producto ${product.title}`
                    );
                } else {
                    product.stock -= prod.quantity;
                    await product.save();
                    cart.products = cart.products.filter(
                        (p) => p.product.toString() !== prod.product.toString()
                    );
                    await cart.save();
                }
            }

            req.session.originalCart = originalCart;
            res.redirect(`/ticket/${cid}`);
        }
    };
}
