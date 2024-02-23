import { Router } from "express";
import Product from "../dao/models/product.model.js";

const routerProducts = new Router();

routerProducts.get('/', async(req, res) => {
    const { limit } = req.query;
    try {
        const products = await Product.find();
        let limitedProducts = [];
        
        if (!limit) {
            res.status(200).json({
                message: `Se muestran todos los productos`,
                products: products
            });
        }
        else {
            for (let i = 0; i < limit; i++) {
                limitedProducts.push(products[i]);
            }
            res.status(200).json({
                message: `Se muestran los primeros ${limit} resultados.`,
                data: limitedProducts
            });
        }



    } catch (error) {
        res.status(500).json(
            {
                message: 'Error al buscar los productos',
                error: error.message
            }
        )        
    }
    
})

routerProducts.get('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) {
            res.status(200).json(
                {
                    message: `Producto encontrado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al buscar el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.post('/', async(req, res) => {
    try {
        await Product.create(req.body);
        res.status(201).json(
            {
                message: `Producto creado`,
                data: req.body
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                message: `Error al crear el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.put('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (product) {
            res.status(200).json(
                {
                    message: `Producto actualizado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al actualizar el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.delete('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.status(200).json(
                {
                    message: `Producto eliminado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al eliminar el producto`,
                error: error.message
            }
        )
    }
})

export default routerProducts;