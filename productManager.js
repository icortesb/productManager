const fs = require('fs/promises')

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        let data = JSON.stringify(this.products, null, 2)
        fs.writeFile('./productos.json', data, {encoding: 'utf-8'})  
        .then((data) => {
            console.log('Archivo creado con exito')
        })
        .catch((err) => {
            console.log('Error al crear el archivo: ', err)
        })     
    }
    
    getProducts() {
        let productos = fs.readFile('./productos.json', 'utf-8');
        productos.then((data) => {
            console.log(data)
        })
        .catch((err) => {
            console.log('Error al leer el archivo: ', err)
        })
    }
    
    getProductById(id) {          
        const foundProduct = this.products.find((product) => product.id === id);
        
        if (!foundProduct){
            console.log('Not found');
        } else {
            console.log(foundProduct);
            return foundProduct;
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

        if(product.title === undefined || product.description === undefined || product.price === undefined  || product.thumbnail === undefined  || product.code === undefined  || product.stock === undefined){
            console.log('Por favor, proporcione todos los parámetros: title, description, price, thumbnail, code y stock.');
            return;
        }


        // Si el producto no existe, lo agrega.
        let productExists = this.products.find((el) => el.code === product.code);
        
        if (!productExists) {
            this.setId(product);
            this.products.push(product);
            console.log(`El producto ${product.title} se agrego correctamente.`);
        } else {
            console.log(`El producto ${product.title} ya existe.`);
        }
    
    }

    updateProduct(id, campo) {
        // Debe recibir el id del producto a actualizar, asi tambien como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo
    }

    deleteProduct(id) {
        let productoAEliminar = this.getProductById(id);
        this.products.filter((product) => {
            product !== productoAEliminar          
        })
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

const productManager = new ProductManager();

// const product1 = new Producto('Producto 1', 'Descripcion 1', 100, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0001', 10);

// productManager.addProduct(product1);

// const product2 = new Producto('Producto 2', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0002', 10);
// productManager.addProduct(product2);
// productManager.getProducts(); // Devuelve los productos.
// productManager.getProductById(1); // Devuelve el producto con id 1.
// productManager.getProductById(10); // Devuelve que no existe el producto con ese id.
// productManager.addProduct(product1); // Devuelve que el producto ya existe.

// const product3 = new Producto('Prueba producto', 'Descripcion 3', 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0003', 10);
// productManager.addProduct(product3); // Devuelve que faltan propiedades. 