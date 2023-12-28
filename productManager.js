const fs = require('fs/promises')
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    saveDataToFile = async () => {
        try {
            const data = JSON.stringify(this.products, null, 4)
            await fs.writeFile(this.path , data, {encoding: 'utf-8'})   
        } catch (error) {
            console.log(`Error al guardar el archivo. Por favor, revisar que la ruta sea correcta. ${error}`)            
        }
    }
    
    getProducts = async () => {
        try {
            const productos = await fs.readFile(this.path, 'utf-8');
            return(JSON.parse(productos));
        } catch (error) {
            console.log(`Error al leer el archivo: ${error}`)
            return [];         
        }
    }
    
    getProductById(id) {          
        return this.products.find((product) => product.id === id) || null;
    }
    
    setId(product) {
        // Si el array esta vacio, el id es 1, sino, el id es el ultimo id + 1.
        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }
    }
    
    async addProduct(product) {

        // Valido que el producto tenga todas las propiedades. Si no las tiene, frena la ejecucion.

        if(product.title === undefined || product.description === undefined || product.price === undefined  || product.thumbnail === undefined  || product.code === undefined  || product.stock === undefined){
            console.log('Por favor, proporcione todos los parámetros: title, description, price, thumbnail, code y stock.');
            return;
        }


        // Si el producto no existe, lo agrega.
        const productExists = this.products.find((el) => el.code === product.code);
        
        if (!productExists) {
            this.setId(product);
            this.products.push(product);
            await this.saveDataToFile()
            console.log(`El producto ${product.title} se agrego correctamente.`);
        } else {
            console.log(`El producto ${product.title} ya existe.`);
        }
    
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock) {
        const producto = this.getProductById(id);
       
            if (producto) {
                producto.title = title;
                producto.description = description;
                producto.price = price;
                producto.thumbnail = thumbnail;
                producto.code = code;
                producto.stock = stock;
                
                await this.saveDataToFile();
                console.log(`Producto con ID ${id} actualizado correctamente.`);
            } else {
                console.log(`El producto con el id ${id} no existe.`)
            }
      
    }
    
    
    async deleteProduct(id) {
        try {
            const productoAEliminar = this.getProductById(id);
            this.products = this.products.filter((product) => {
                return product !== productoAEliminar
            });
            const data = JSON.stringify(this.products, null, 4)
            await fs.writeFile('productosActualizados.json' , data, {encoding: 'utf-8'}); // Se guarda en un nuevo archivo por problemas al sobreescrbir el archivo original. Pareceria como que esta en uso y no se comporta correctamente. A resolver.
            console.log(`Producto con ID ${id} eliminado correctamente.`);
        } catch (error) {
            console.log(`Error al eliminar el producto con ID ${id}: ${error}`);
        }
    }
}

class Producto{
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

}


// Ejemplo

const productManager = new ProductManager('./productos.json');
const product1 = new Producto('Producto 1', 'Descripcion 1', 100, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0001', 10);
productManager.addProduct(product1);
const product2 = new Producto('Producto 2', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0002', 10);
productManager.addProduct(product2);
// productManager.getProducts(); // Devuelve los productos.
// console.log(productManager.getProductById(1)); // Devuelve el producto con id 1.
// productManager.getProductById(10); // Devuelve que no existe el producto con ese id.
// productManager.addProduct(product1); // Devuelve que el producto ya existe.

// const product3 = new Producto('Prueba producto', 'Descripcion 3', 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0003', 10);
// productManager.addProduct(product3); // Devuelve que faltan propiedades. 

productManager.updateProduct(1, 'Nuevo titulo', 'Articulo modificado', 50002, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0001', 50)
// // productManager.getProducts();
// productManager.getProductById(2);
productManager.deleteProduct(2)