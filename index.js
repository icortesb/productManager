const express = require('express');
const ProductManager = require('./productManager')

const PM = new ProductManager();
const app = express();

let PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
})


// API

app.get('/products', (req, res) => {
    let limit = req.query.limit;

    if (!limit) {
        // Devolver todos los productos
        PM.getProducts()
        .then((data) => {
            res.send(
                {
                    message: 'Datos leidos',
                    data: JSON.parse(data, null, 4)
                });
        })
        .catch((err) => {
            res.status(500).send(
                {
                    message: 'Error al obtener los productos',
                    error: err.message
                })
        })
    } else {
        PM.getProducts()
        .then((data) => {
            const productos = JSON.parse(data, null, 4);
            let productosLimit = [];
            for (let i = 0; i < limit; i++) {
                productosLimit.push(productos[i])                
            }
            res.send(
                {
                    message: `Se muestran los primeros ${limit} resultados.`,
                    data: productosLimit
                }
            )
        })
        .catch((err) => {
            res.status(500).send(
                {
                    message: 'Error al obtener los productos',
                    error: err.message
                }
            )
        })
    }
})

//            '/products/:pid => Debe recibir por req.params el id y devolver solo el producto solicitado.


app.get('/products/:pid', (req, res) => {
    const id = req.params.pid;
    PM.getProductById(id)
    .then((product) => {
        if (product) {
            res.send(
                {
                    message: `Producto encontrado`,
                    data: product
                }
            )
        } else {
            res.status(404).send(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    })
    .catch((err) => {
        res.status(500).send(
            {
                message: `Error al obtener el producto`,
                error: err.message
            }
        )
    })
})