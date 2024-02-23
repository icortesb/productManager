import { Router } from "express";
import { ProductManager } from "../dao/fileSystem/productManager.js";
import { io } from "../app.js";


const PM = new ProductManager('./src/models/productos.json');

//CRUD PRODUCTOS

const routerProd = Router();

// Limit

routerProd.get('/', async (req, res) => {
    const { limit } = req.query;

    try {
        const products = JSON.parse(await PM.getProducts());
        let limitedProducts = [];

        if (!limit) {
            io.emit('getProducts', { products: products });
            res.status(200).json({
                message: `Se muestran todos los productos`,
                products: products
            });
        } else {
            for (let i = 0; i < limit; i++) {
                limitedProducts.push(products[i]);
            }
            io.emit('getProducts', { products: limitedProducts });
            res.status(200).json({
                message: `Se muestran los primeros ${limit} resultados.`,
                data: limitedProducts
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: `Error al obtener los productos`,
            error: error.message
        });
    }
});

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
    try {
        const product = req.body;
        const addedProduct = await PM.addProduct(product);
        const products = JSON.parse(await PM.getProducts());
        if (addedProduct) {
            io.emit('getProducts', { products: products });
            res.json(
                {
                    message: `Producto agregado correctamente.`
                    
                }
            )
        } else {
            res.status(400).json(
                {
                    message: `El producto ya existe o faltan parametros..`
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