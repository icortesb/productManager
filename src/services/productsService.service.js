import Product from "../dao/mongo/models/product.model.js";

export const findProducts = async () => {
    try {
        return await Product.find().lean();
    } catch (error) {
        throw new Error(`Error al leer los productos: ${error.message}`);
    }
};

export const findProductById = async (id) => {
    try {
        return await Product.findById(id);
    } catch (error) {
        throw new Error(`Error al leer el producto: ${error.message}`);
    }
};

export const createProduct = async (product) => {
    try {
        return await Product.create(product);
    } catch (error) {
        throw new Error(`Error al crear el producto: ${error.message}`);
    }
};

export const updateProduct = async (id, product) => {
    try {
        return await Product.findByIdAndUpdate(id, product, {new: true});
    } catch (error) {
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
};

export const deleteProduct = async (id) => {
    try {
        return await Product.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
};