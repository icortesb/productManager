const fs = require('fs/promises')
class ProductManager {
    constructor() {
        this.path = './productos.json';
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
            const product = products.find((el) => el.id === id) || null;
            return product;
        } catch (err) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${err}`);
            return null;
        }
    }
    
    setId(product) {
        // Si el array esta vacio, el id es 1, sino, el id es el ultimo id + 1.
        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }
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

module.exports = ProductManager;


// Ejemplos

const productManager = new ProductManager();

// Producto 1
const product1 = {
    title: 'Laptop Gaming ASUS ROG Strix G15 - Intel i7, 16GB RAM, NVIDIA RTX 3070, 1TB SSD',
    description: 'Experimenta el rendimiento excepcional con la Laptop Gaming ASUS ROG Strix G15. Equipada con un potente procesador Intel Core i7, 16GB de RAM para multitareas fluidas y una tarjeta gráfica NVIDIA GeForce RTX 3070 para una experiencia de juego inmersiva. Almacenamiento ultrarrápido de 1TB SSD para tiempos de carga rápidos. La pantalla Full HD de 15.6 pulgadas con una alta tasa de refresco te sumerge en tus juegos favoritos. Diseño estilizado y teclado retroiluminado para una experiencia gaming completa.',
    price: 1899.99,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png',
    code: ' ASUSROGG15-3070',
    stock: 50};
// productManager.addProduct(product1);

// Producto 2
const product2 = {
    title : 'Monitor Curvo Samsung Odyssey G7 - 32 pulgadas, QLED, 240Hz, 1ms, G-Sync, FreeSync Premium Pro',
    description: 'Sumérgete en la acción con el monitor curvo Samsung Odyssey G7. Con una pantalla QLED de 32 pulgadas y una frecuencia de actualización de 240Hz junto con un tiempo de respuesta de 1ms, este monitor ofrece una experiencia de juego sin igual. La tecnología G-Sync y FreeSync Premium Pro garantizan imágenes fluidas y libres de tearing. El diseño curvo 1000R proporciona una inmersión completa en tus juegos favoritos y trabajos creativos. Además, cuenta con un elegante sistema de iluminación ambiental en la parte trasera.',
    price: 799.99,
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64bus-vehicle-transport-school-128.png',
    code: 'SAMG7-32QLED',
    stock: 30
};