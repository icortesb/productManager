import Cart from "../dao/models/carts.model";

const findCarts = async () => {
    try {
        const carts = await Cart.find();
        return carts;
    } catch (error) {
        console.log(`Error al leer los carritos: ${error.message}`);
    }
}