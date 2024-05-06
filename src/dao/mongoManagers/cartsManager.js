import Cart from "../mongo/models/carts.model.js";
import Product from "../mongo/models/product.model.js";
export class CartManager {
    constructor(path) {
        this.path = path;
    }

    getCarts = async () => {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.log(`Error al leer los carritos: ${error.message}`);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await Cart.findById(id).lean();
            return cart;
        } catch (error) {
            console.log(`Error al leer el carrito: ${error.message}`);
            return false;
        }
    }

    newCart = async () => { 
        try {
            const newCart = await Cart.create(
                {
                    date: new Date().toISOString()
                }
            );
            const cart = await Cart.findById(newCart._id).lean();
            return cart;
        } catch (error) {
            console.log(`Error al crear el carrito: ${error.message}`);
            return false;
        }
    }

    saveCartsById = async (cid, pid) => {
        try {
            const cart = await Cart.findById(cid);
            const productById = await Product.findById(pid);
            if (!cart || !productById) {
                return false;
            }
            
            const productIndex = cart.products.findIndex(prod => prod.product.title === productById.title);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
    
            const updatedCart = (await cart.save()).populate('products.product');
            return updatedCart;
        } catch (error) {
            console.log(`Error al guardar el carrito: ${error.message}`);
            return false;
        }
    }
    

    deleteProductById = async (cid, pid) =>  {
        try {
            const cart = await Cart.findById(cid);
            const productById = await Product.findById(pid);
            if (!cart || !productById) {
                return false;
            }
            const productIndex = cart.products.findIndex(prod => prod.product.title === productById.title);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                const updatedCart = await cart.save();
                return updatedCart;
            } else {
                return false;
            }   
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error.message}`);
            return false;            
        }
    }

    updateProductById = async (cid, pid, quantity) => {
        try {
            const cart = await Cart.findById(cid);
            const productById = await Product.findById(pid);
            if (!cart || !productById) {
                return false;
            }
            
            const productIndex = cart.products.findIndex(prod => prod.product.title === productById.title);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                const updatedCart = await cart.save();
                return updatedCart;
            } else {
                return false;
            }
        } catch (error) {
            console.log(`Error al actualizar el producto: ${error.message}`);
            return false;
        }
    }
    

    updateCart = async (id, data) => {
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: id },
                { $push: { products: data } },
                { new: true }
            );
            return cart;
        } catch (error) {
            console.log(`Error al actualizar el carrito: ${error.message}`);
            return false;
        }
    }
    

    deleteAllProducts = async (id) => {
        try {
            const cart = await Cart.findByIdAndUpdate(id, {
                $set: {
                    products: []
                }
            }, { new: true });
            return cart;
        } catch (error) {
            console.log(`Error al eliminar todos los productos: ${error.message}`);
            return false;
        }
    }    
}