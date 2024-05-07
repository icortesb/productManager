import { Router } from "express";
import { ProductManager } from "../controllers/productManager.js";

const routerProducts = new Router();
const productManager = new ProductManager();

routerProducts.get('/', productManager.getProducts);
routerProducts.get('/:id', productManager.getProductById);
routerProducts.post('/', productManager.addProduct);
routerProducts.put('/:id', productManager.updateProduct); 
routerProducts.delete('/:id', productManager.deleteProduct);

export default routerProducts;