import {findProducts, findProductById, createProduct, updateProduct, deleteProduct } from "../../../services/products.service.js";

export class ProductManager {
       
    getProducts = async (req,res) => {
        try {
            const products = await findProducts();
            if (products) {
                res.status(200).json(
                    {
                        message: `Productos encontrados`,
                        products: products
                    }
                )
            } else {
                res.status(404).json(
                    {
                        message: `No se encontraron productos`
                    }
                )
            }
        } catch (error) {
            res.status(500).json(
                {
                    message: `Error al buscar los productos`,
                    error: error.message
                }
            )
        }        
    }
    
    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await findProductById(id);
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
    }

    addProduct = async (req, res) => {
        let product = req.body;
        product = await createProduct(product);
        return res.status(201).json(
            {
                message: `Producto creado`,
                product: product
            }
        )
    }

    updateProduct = async (req, res) => {
        const { id } = req.params;
        try {
            const product = await updateProduct(id, req.body);
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
}

    deleteProduct = async (req, res) => {
        const { id } = req.params;
        try {
            const product = await deleteProduct(id);
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
    }

    returnAllProducts = async () => {
        const products = await findProducts();
        return products;
    }
}