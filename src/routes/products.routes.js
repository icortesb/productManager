import { Router } from "express";
import { ProductManager } from "../dao/mongo/controllers/productManager.js";
import { authRole } from "../middleware/auth.js";

const routerProducts = new Router();
const productManager = new ProductManager();

routerProducts.get('/', productManager.getProducts);
routerProducts.get('/:id', productManager.getProductById);
routerProducts.post('/', authRole('premium'), productManager.addProduct);
routerProducts.put('/:id', authRole('admin'), productManager.updateProduct); 
routerProducts.delete('/:id', authRole('admin'), productManager.deleteProduct); // Modificar middleware para que premium solo pueda borrar productos que le pertenecen y admin pueda borrar cualquier producto

export default routerProducts;