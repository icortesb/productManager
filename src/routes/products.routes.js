import { Router } from "express";
import { ProductManager } from "../models/productManager.js";

const PM = new ProductManager('./src/models/productos.json');
//CRUD PRODUCTOS

const routerProd = Router();

// Limit

routerProd.get('/', async (req, res) => {
    const { limit } = req.query;
    console.log(limit)

    if(!limit) {
        try {
            const products = await PM.getProducts()
            console.log(products)
            res.json(
                {
                    message: `Se muestran todos los productos`,
                    products: JSON.parse(products, null, 4)
                }
            )
        }        
        catch (error) {
            res.status(500).json(
                {
                    message: `Error al obtener los productos`,
                    error: error.message
                }
            )        
        }
    } else {
        try {
            const products = JSON.parse(await PM.getProducts(), null, 4);
            let limitedProducts = [];
            for (let i = 0; i < limit; i++) {
                limitedProducts.push(products[i])                
            }
            res.json(
                {
                    message: `Se muestran los primeros ${limit} resultados.`,
                    data: limitedProducts
                }
            )
        }           
        catch (error) {
            res.status(500).json(
                {
                    message: `Error al obtener los productos`,
                    error: error.message
                }
            )            
        }
    }
})

routerProd.get('/:id', async (req, res)  => {
    const { id } = req.params;
    try{
        const product = await PM.getProductById(id);
        if (product) {
            res.json(
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
    }
    catch(error) {
        res.status(500).json(
            {
                message: `Error al obtener el producto`,
                error: error.message
            }
        )
    }
})

routerProd.post('/', async (req, res) => {
    const product = req.body;
    try {
        const addedProduct = await PM.addProduct(product);
        if (addedProduct) {
            res.json(
                {
                    message: `Producto agregado correctamente.`,
                }
            )
        } else {
            res.status(400).json(
                {
                    message: `El producto ya existe.`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al agregar el producto.`,
                error: error.message
            }
        )
    }
})

routerProd.put('/:id', async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const updatedProduct = await PM.updateProduct(id, product);
        if (updatedProduct) {
            res.json(
                {
                    message: `Producto actualizado correctamente.`,
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado.`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al actualizar el producto.`,
                error: error.message
            }
        )
    }
})

routerProd.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await PM.deleteProduct(id);
        if (deletedProduct) {
            res.json(
                {
                    message: `Producto eliminado correctamente.`,
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado.`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al eliminar el producto.`,
                error: error.message
            }
        )
    }
})

export default routerProd;