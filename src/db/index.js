import mongoose from "mongoose";
import Cart from "../dao/models/carts.model.js"; // Solo para test
import Product from "../dao/models/product.model.js"; // Solo para test

export default {
    connect: async () => {
        try {
            await mongoose.connect("mongodb+srv://ivancb97:Soz47261@proyectocoder.iu36jco.mongodb.net/ecommerce");
            console.log('Conectado a la base de datos');

            // Cart.create(
            //     {
            //         date: '2021-08-10'
            //     }
            // )

            // Product.create(
            //     {
            //         title: 'Monitor 1',
            //         description: 'Monitor 1',
            //         category: 'Monitores',
            //         price: 10000,
            //         code: 'MON1',
            //         stock: 10
            //     }
            // )


            // let cart1 = await Cart.findById('65de1183a005e2cf4c545d56').populate('products.product').exec();

            // await cart1.populate('products.product').execPopulate();

            let cart1 = await Cart.findOne({_id: '65de1183a005e2cf4c545d56'})

            cart1.products.push({
                product: '65d7e03a9a75431e13112b6f'
            });

            await cart1.save();

            cart1 = await Cart.findOne({_id: '65de1183a005e2cf4c545d56'})
                // .populate('products.product')
                // .exec();

            console.log(JSON.stringify(cart1, null, '\t'));



        } catch (error) {
            console.log(`Error al conectar a la base de datos: ${error}`);
        }
    }
}