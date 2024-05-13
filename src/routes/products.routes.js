import { Router } from "express";
import { ProductManager } from "../dao/mongo/controllers/productManager.js";
import { authRole } from "../middleware/auth.js";

const routerProducts = new Router();
const productManager = new ProductManager();

routerProducts.get('/', productManager.getProducts);
routerProducts.get('/:id', productManager.getProductById);
routerProducts.post('/', authRole('admin'), productManager.addProduct);
routerProducts.put('/:id', authRole('admin'), productManager.updateProduct); 
routerProducts.delete('/:id', authRole('admin'), productManager.deleteProduct);

export default routerProducts;