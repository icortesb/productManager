import { Router } from "express";
import Product from "../dao/models/product.model.js";

const route = new Router();

route.get('/allProducts', async(req, res) => {

    try {
        let response = await Product.find()
        res.send(
            {
                message: 'Productos encontrados',
                data: response
            }
        )
        
    } catch (err) {
      res.status(400).json(
          {
              message: 'Error al buscar los productos',
              error: err.message
          }
      )
    }
    
})

route.post('/newProduct', async(req, res) => {
   try {
    await Product.create(req.body)
    res.status(201).json(
        {
            msg: 'Producto creado',
            data: req.body
        }
    )   
   } catch (err) {
         res.status(400).json(
             {
                 msg: 'Error al crear el producto',
                 error: err.message
             }
         )
   }
})

export default route;