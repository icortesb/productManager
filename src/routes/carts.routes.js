import { Router } from "express";
import { CartManager } from "../dao/mongoManagers/cartsManager.js";
import { ProductManager } from "../dao/mongoManagers/productManager.js";

const routerCarts = Router();
const CM = new CartManager('./src/models/carts.json');
const PM = new ProductManager('./src/models/productos.json');

routerCarts.post('/', async (req, res) => {
    try {
        const cart = await CM.newCart();
        res.status(201).json(
            {
                message: `Se ha creado un nuevo carrito`,
                id: cart._id
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al crear el carrito. Intente nuevamente: ${error.message}`
            }
        );
    }
})

routerCarts.get('/:id', async (req, res) => {
    const { id } = req.params;
    const cart = await CM.getCartById(id);
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
})

routerCarts.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    let cart = await CM.getCartById(cid);
    const product = await PM.getProductById(pid);
    if (!cart || !product) {
        return res.status(404).json({
            message: 'Carrito o producto no encontrado'
        });
    } else {
        cart = await CM.saveCartsById(cid, pid);
        // res.status(201).json(
        //     {
        //         message: 'Producto agregado correctamente',
        //         cart: cart
        //     }
        // )
        res.redirect(`/carts/${cid}`);
    }
})

routerCarts.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await CM.getCartById(cid);
    if (!cart) {
        return res.status(404).json(
            {
            message: 'Carrito no encontrado'
            }
        );
    } else {
        let deletedProduct = await CM.deleteProductById(cid, pid);
        if (!deletedProduct) {
            return res.status(404).json(
                {
                    message: 'Producto no encontrado'
                }
            );
        } else {
            res.status(200).json(
            {
                message: 'Producto eliminado correctamente',
                cart: cart
            }
        )}
        
    }
})

routerCarts.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        let cart = await CM.getCartById(cid);
        if (!cart) {
            return res.status(404).json(
                {
                    message: 'Carrito no encontrado'
                }
            );
        } else {
            const { products } = req.body;
            if (!products) {
                return res.status(400).json(
                    {
                        message: 'No se han enviado productos'
                    }
                );
            }
            let cart = await CM.updateCart(cid, products);
            res.status(200).json(
                {
                    message: 'Carrito actualizado correctamente',
                    cart: cart
                }
            )
        }    
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al actualizar el carrito. Intente nuevamente: ${error.message}`
            }
        );    
    }
})

routerCarts.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        let cart = await CM.getCartById(cid);

        if (!cart) {
            return res.status(404).json(
                {
                    message: 'Carrito no encontrado'
                }
            );
        } else {
            if (!quantity) {
                return res.status(400).json(
                    {
                        message: 'No se ha enviado la cantidad'
                    }
                );
            }
            cart = await CM.updateProductById(cid, pid, quantity);
            res.status(200).json(
                {
                    message: 'Producto actualizado correctamente',
                    cart: cart
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al actualizar el producto. Intente nuevamente: ${error.message}`
            }
        );        
    }
})

routerCarts.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    let cart = await CM.getCartById(cid);
    if (!cart) {
        return res.status(404).json(
            {
                message: 'Carrito no encontrado'
            }
        );
    } else {
        cart = await CM.deleteAllProducts(cid);
        res.status(200).json(
            {
                message: 'Productos eliminados correctamente',
                cart: cart
            }
        )
    }
})

export default routerCarts;