import { Router } from "express";
import { ProductManager } from "../dao/mongo/controllers/productManager.js";
import { authRole } from "../middleware/auth.js";

const routerProducts = new Router();
const productManager = new ProductManager();

routerProducts.get('/', productManager.getProducts);
routerProducts.get('/:id', productManager.getProductById);
routerProducts.post('/', authRole(['premium', 'admin']), productManager.addProduct);
routerProducts.put('/:id', authRole(['premium', 'admin']), productManager.updateProduct); 
routerProducts.delete('/:id', authRole(['premium', 'admin']), productManager.deleteProduct); 
export default routerProducts;