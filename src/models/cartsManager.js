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

    saveCartsById = async (cid, pid) => {

        try {
            const carts = JSON.parse(await this.getCarts());
            const cart = await this.getCartById(cid);
            const productInCart = cart.products.find(product => product.id === pid);

            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.products.push(
                    {
                        id: pid,
                        quantity: 1
                    }
                )
            }

            const newCarts = carts.filter(cart => cart.id !== cid);
            newCarts.push(cart);
            newCarts.sort((a, b) => a.id.localeCompare(b.id));

            fs.writeFile(this.path, JSON.stringify(newCarts, null, 4), 'utf-8');
            return true;
            
        } catch (error) {
            console.log(`Error al guardar el carrito: ${error.message}`);
            return false;            
        }
    
    }
}