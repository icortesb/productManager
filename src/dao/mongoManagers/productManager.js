import mongoose from "mongoose";
import Product from "../models/product.model.js";

export class ProductManager {
       
    getProducts = async () => {
        try {
            const products = await Product.find().lean();
            return products;
        } catch (error) {
            console.log(`Error al leer los productos: ${error.message}`);
        }
    }
    
    async getProductById(id) {  
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            console.log(`Error al leer el producto: ${error.message}`);
            return false;
        }
    }
        

    addProduct = async (product) => {
        try {
            const newProduct = await Product.create(product);
            return newProduct;
        } catch (error) {
            console.log(`Error al crear el producto: ${error.message}`);
            return false;
        }
    }

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log(`Error al actualizar el producto: ${error.message}`);
            return false;
        }
}

    deleteProduct = async (id) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error.message}`);
            return false;
        }
    }
}