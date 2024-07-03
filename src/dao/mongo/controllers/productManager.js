import {findProducts, findProductById, createProduct, updateProduct, deleteProduct } from "../../../services/products.service.js";
import { verifyJWT } from "../../../utils/jwt.js";
import { UserManager } from "./userManager.js";
const userManager = new UserManager();

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
        const { title, description, category, price, thumbnails, code, stock } = req.body;
        const token = req.cookies["jwt"];
        const decodedToken = verifyJWT(token);
        const user = decodedToken.user;
        const userId = await userManager.getUserId(user);
        console.log('userId:', userId)
        const owner = userId;  

        const product = await createProduct({ title, description, category, price, thumbnails, code, stock, owner });
        return res.redirect('/products');
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
        // premiumn solo puede borrar los productos que le pertenecen
        const { id } = req.params;
        const token = req.cookies["jwt"];
        const decodedToken = verifyJWT(token);
        const role = decodedToken.role;

        if (role !== 'admin') {
            const userId = await userManager.getUserId(decodedToken.user);
            const product = await findProductById(id);
            if (parseInt(product.owner._id) !== parseInt(userId)) {
                return res.status(403).json({ message: `No tienes permiso para borrar este producto porque no te pertenece` });
            } else {
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
        }
        
    }

    returnAllProducts = async () => {
        const products = await findProducts();
        return products;
    }
}