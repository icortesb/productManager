import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    saveDataToFile = () => {     
        const data = JSON.stringify(this.products, null, 4);
        fs.writeFile(this.path, data, 'utf-8')
        .catch((err) => {
            console.log(`Error al guardar el archivo. Por favor revise que la ruta sea correcta ${err}`)
        })
    }
    
    getProducts = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            console.log(`Archivo leido correctamente`);
            return data;
        } catch (err) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${err}`);
        }
    }
    
    async getProductById(id) {  
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find((el) => el.id === parseInt(id)) || null;
            return product;
        } catch (err) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${err}`);
            return null;
        }
    }
    
    // Modificar para que no depende del array
    setId(product) {
        product.id = uuidv4();
    }
    
    addProduct(product) {
        // Valido que el producto tenga todas las propiedades. Si no las tiene, frena la ejecucion.

        if(product.title === undefined || product.description === undefined || product.price === undefined || product.thumbnail === undefined || product.code === undefined || product.stock === undefined) {
            return 'Por favor, proporcione todos los parámetros: title, description, price, thumbnail, code y stock.'
        }

        // Si el producto no existe, lo agrega.

        const productExists = this.products.find((el) => el.code === product.code);

        if (!productExists) {
            this.setId(product);
            this.products.push(product);
            this.saveDataToFile();
        } else {
            console.log(`El producto ${product.title} ya existe.`)
        }
    }

    updateProduct(id, title, description, price, thumbnail, code, stock) {
        const producto = this.getProductById(id);

        if (producto) {
            producto.title = title;
            producto.description = description;
            producto.price = price;
            producto.thumbnail = thumbnail;
            producto.code = code;
            producto.stock = stock;
            
            this.saveDataToFile();
            console.log(`El producto ${producto.title} se guardó correctamente.`)
        } else {
            console.log(`El producto con el id ${id} no existe.`)
        }
    }

    deleteProduct(id) {
        fs.readFile(this.path, 'utf-8')
        .then((data) => {
            this.products = JSON.parse(data);
            this.products = this.products.filter((el) => el !== this.getProductById(id));
            this.saveDataToFile()
        })
        .catch((err) => {
            console.log(`No se pudo eliminar el producto. Error: ${err}`);
        })
    }
}
