import { Router } from "express";
import Product from "../dao/models/product.model.js";
import { ProductManager } from "../dao/mongoManagers/productManager.js";
import paginate from 'mongoose-paginate-v2';
import __dirname from '../utils/dirname.js';

const routerProducts = new Router();
const PM = new ProductManager();

routerProducts.get('/', async(req, res) => {
    const { limit, page, sort, query } = req.query;

    let options = {
        limit: limit || 10,
        page: page || 1,
    };

    if (sort == 'asc') {
        options.sort = { price: 1 }
    }
    else if (sort == 'desc') {
        options.sort = { price: -1 }
    }

    let productsQuery = {};

    if (query) {
        productsQuery.name = query;
    }

    try {
        let products = await Product.paginate(productsQuery, options);

        res.status(200).json(
            {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.hasPrevPage ? products.prevPage : false,
                nextPage: products.hasNextPage ? products.nextPage : false,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `${__dirname}/api/products?limit=${options.limit}&page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `${__dirname}/api/products?limit=${options.limit}&page=${products.nextPage}` : null
            }
        )
    } catch (error) {
        res.status(500).json(
            {
               status: 'error',
               message: error.message
            }
        )
    }
})

routerProducts.get('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) {
            res.status(200).json(
                {
                    message: `Producto encontrado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al buscar el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.post('/', async(req, res) => {
    try {
        await Product.create(req.body);
        res.status(201).json(
            {
                message: `Producto creado`,
                data: req.body
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                message: `Error al crear el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.put('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (product) {
            res.status(200).json(
                {
                    message: `Producto actualizado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al actualizar el producto`,
                error: error.message
            }
        )
    }
})

routerProducts.delete('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.status(200).json(
                {
                    message: `Producto eliminado`,
                    product: product
                }
            )
        } else {
            res.status(404).json(
                {
                    message: `Producto no encontrado`
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                message: `Error al eliminar el producto`,
                error: error.message
            }
        )
    }
})

export default routerProducts;