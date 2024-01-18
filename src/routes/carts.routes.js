import { Router } from "express";
import { CartManager } from "../models/cartsManager.js";

const routerCarts = Router();
const CM = new CartManager('./src/models/carts.json');

routerCarts.post('/', async (req, res) => {
    try {
        const cart = await CM.newCart();

        if (cart) {
            res.status(201).json(
                {
                    message: `Se ha creado un nuevo carrito`,
                    id: cart.id
                }
            )
        } else {
            res.status(400).json(
                {
                    message: `Error al crear el carrito. Por favor, revisar que la ruta sea correcta.`
                }
            )
        }
        
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al crear el carrito. Intente nuevamente: ${error.message}`
            }
        )        
    }
})

routerCarts.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await CM.getCartById(id);
        if (cart) {
            res.status(200).json(
                {
                    message: `Se muestra el carrito con el id ${cart.id}`,
                    carrito: cart.products
                }
            )
        } else {
            res.status(401).json(
                {
                    message: `Error al obtener el carrito. Por favor, revise que el id sea correcto.`
                }
            )
        }
        
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al obtener el carrito. Intente nuevamente: ${error.message}`
            }
        )        
    }

})

    routerCarts.post('/:cid/product/:pid', async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const carrito = await CM.getCartById(cid);
            if (carrito) {
                carrito.products.push({
                    productId: pid,
                    quantity: carrito.products.length + 1
                });
                await CM.saveCartsById(cid, carrito.products);

                res.status(201).json(
                    {
                        message: 'Producto agregado correctamente',
                    }
                )

            } else {
                res.status(400).json(
                    {
                        message: 'Error'
                    }
                )    
            }
            
        } catch (error) {
            res.status(500).json(
                {
                    message: `Error al agregar el producto. Intente nuevamente: ${error.message}`
                }
            )
        }
    })

export default routerCarts;