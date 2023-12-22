class ProductManager {
    constructor() {
        this.products = [];
    }
    
    getProducts() {
        console.log(this.products);
    }
    
    getProductById(id) {          
        const foundProduct = this.products.find((product) => product.id === id);
        
        if (!foundProduct){
            console.log('Not found');
        } else {
            console.log(foundProduct);
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
        // Si el producto no existe, lo agrega.
        let productFind = this.products.find((el) => el.code === product.code);
        
        if (!productFind) {
            this.setId(product);
            this.products.push(product);
            console.log(`El producto ${product.title} se agrego correctamente.`);
        } else {
            console.log(`El producto ${product.title} ya existe.`);
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

const productManager = new ProductManager();

const product1 = new Producto('Producto 1', 'Descripcion 1', 100, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0001', 10);

productManager.addProduct(product1);

const product2 = new Producto('Producto 2', 'Descripcion 2', 200, 'https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png', '0002', 10);
productManager.addProduct(product2);
productManager.getProducts(); // Devuelve los productos.
productManager.getProductById(1); // Devuelve el producto con id 1.
productManager.getProductById(10); // Devuelve que no existe el producto con ese id.
productManager.addProduct(product1); // Devuelve que el producto ya existe.
