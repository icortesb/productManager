import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    getProducts = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return data;
        } catch (error) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${error.message}`);
        }
    }
    
    async getProductById(id) {  
        try {
            const products = JSON.parse(await this.getProducts());
            const product = products.find((el) => el.id === parseInt(id)) || null;
            return product;
        } catch (err) {
            console.log(`Error al obtener el producto. Por favor, revise que el id sea correcto ${err.message}`);
            return false;
        }
    }
        

    addProduct = async (product) => {
        const { title, description, category, price, thumbnails, code, stock } = product;
        const status = product.status !== undefined ? product.status : true;

        if (title === undefined || description === undefined || category === undefined || price === undefined || code === undefined || stock === undefined) {
            console.log('Por favor, proporcione todos los parámetros: title, description, category, price, code y stock.');
            return false;
        }

        try {
            const prods = JSON.parse(await this.getProducts());
            const productExists = prods.find((el) => el.code === product.code);

            if (!productExists) {
                const id = uuidv4();
                const newProduct = { id, title, description, category, price, thumbnails, code, stock, status };
                prods.push(newProduct);
                await fs.writeFile(this.path, JSON.stringify(prods, null, 4));
                console.log('Producto agregado correctamente.');
                return true;
            } else {
                console.log('El producto ya existe.');
                return false;
            }
        } catch (error) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${error}`);
        }
    }

    updateProduct = async (id, product) => {
        const products = JSON.parse(await this.getProducts(), null);
        const prod = await this.getProductById(id);

        if (prod) {
            Object.keys(product).forEach((key) => {
                prod[key] = product[key] || prod[key];
            });
            const filteredProducts = products.filter((el) => el.id !== parseInt(id));
            filteredProducts.push(prod);
            filteredProducts.sort((a, b) => a.id - b.id);
            await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 4));
            return true;
        } else {
            return false;
        }
    }

    deleteProduct = async (id) => {
        try {
            const products = JSON.parse(await this.getProducts());
            const product = products.find((el) => el.id === parseInt(id)) || null;
            if (product) {
                await fs.writeFile(this.path, JSON.stringify(products.filter((el) => el.id !== parseInt(id)), null, 4));
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${err.message}`);
            return false;
        }
    }
}