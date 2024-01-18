import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    getCarts = async () => {
        try {
            const carts = await fs.readFile(this.path, 'utf-8')
            return carts;            
        } catch (error) {
            console.log(`Error al leer el archivo. Por favor revise que la ruta sea correcta ${error.message}`);            
        }
    }

    getCartById = async (id) => {
        const carts = JSON.parse(await this.getCarts());
        const cart = carts.find((el) => el.id == id) || null;
        return cart;          
    }

    newCart = async () => {
        const cart = {
            id: uuidv4(),
            products: []
        }

        try {
            const carts = JSON.parse(await this.getCarts());
            carts.push(cart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 4), 'utf-8');
            return cart;
        } catch (error) {
            console.log(`Error al crear el carrito. Por favor, revisar que la ruta sea correcta: ${error.message}`);
            return false;                      
        }
    }

    saveCartsById = async (id, products) => {
        try {
            const carts = JSON.parse(await this.getCarts());
            const foundCart = carts.find((el) => el.id === id);
            if (foundCart) {
                // Verificar si el productId ya existe en la lista de productos
                // const existingProduct = foundCart.products.find((product) => product.productId === products[0].productId);
                const existingProduct = foundCart.products.find((product) => product.productId === products[0].productId);
    
                if (existingProduct) {
                    // Si existe, sumarle la cantidad
                    existingProduct.quantity++;
                } else {
                    // Si no existe, agregar el nuevo producto a la lista
                    foundCart.products.push(products[0]);
                }
    
                const newCarts = carts.filter((el) => el.id !== id);
                newCarts.push(foundCart);
                await fs.writeFile(this.path, JSON.stringify(newCarts, null, 4), 'utf-8');
                return true;
            } else {
                console.log(`Error: No se encontró el carrito con ID ${id}`);
                return false;
            }



            // Object.assign(foundCart, { id, products });
            // const newCarts = carts.filter((el) => el.id !== id);
            // newCarts.push(foundCart);
            // console.log(newCarts);
            // await fs.writeFile(this.path, JSON.stringify(newCarts, null, 4), 'utf-8');
            // return true;
        } catch (error) {
            console.log(`Error al guardar el carrito. Por favor, revisar que la ruta sea correcta: ${error.message}`);
            return false;                      
        }
    }
}
