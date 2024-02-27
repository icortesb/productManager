import { Router } from "express";
import Cart from "../dao/models/carts.model.js";
import Product from "../dao/models/product.model.js";

const routerCarts = Router();

routerCarts.post('/', async (req, res) => {
    try {
        const cart = await Cart.create({ products: [] });
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

routerCarts.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id);
        if (cart) {
            res.status(200).json(
                {
                    message: `Carrito encontrado`,
                    cart: cart
                }
            );
        } else {
            res.status(404).json(
                {
                    message: `Carrito no encontrado`
                }
            );
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `$Error: ${error.message}`
            }
        );
    }
})

routerCarts.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);
        if (!cart || !product) {
            return res.status(404).json({
                message: 'Carrito o producto no encontrado'
            });
        }

        const productIndex = cart.products.findIndex(prod => prod.id === pid);

        if (productIndex !== -1) {
            const updatedCart = await Cart.findByIdAndUpdate(cid, {
                $set: {
                    products: cart.products.map(prod => {
                        if (prod.id === pid) {
                            prod.quantity++;
                        }
                        return prod;
                    })
                }
            }, { new: true });
            return res.status(200).json(updatedCart);
        } else {
            // const updatedCart = await Cart.findByIdAndUpdate(cid, {
            //     $set: {
            //         products: [...cart.products, { id: pid, quantity: 1 }]
            //     }
            // }, { new: true });
            const updatedCart = await Cart.findOne({ _id: cid }).populate('products.product');
            updatedCart.products.push({product: pid});


            await Cart.updateOne({ _id:
                cid }, updatedCart);

            console.log(JSON.stringify(updatedCart, null, 2));
            return res.status(200).json(updatedCart);
        
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error: ${error.message}`
        });
    }
});





export default routerCarts;