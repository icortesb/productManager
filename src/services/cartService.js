import Cart from "../dao/models/carts.model.js";

export const findCarts = async () => {
    try {
        return await Cart.find();
    } catch (error) {
        throw new Error(`Error al leer los carritos: ${error.message}`);
    }
};
export const findCartById = async (id) => {
    try {
        return await Cart.findById(id);
    } catch (error) {
        throw new Error(`Error al leer el carrito: ${error.message}`);
    }
};

export const createCart = async () => {
    try {
        const newCart = await Cart.create({
            date: new Date().toISOString(),
        });
        return await Cart.findById(newCart._id).lean();
    } catch (error) {
       throw new Error(`Error al crear el carrito: ${error.message}`);
    }
};

export const findCartAndUpdate = async (id, products) => {
    try {
        return await Cart.findOneAndUpdate(
            { _id: id },
            { products: products },
            { new: true }
        );
    } catch (error) {
        throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
};