import {Router} from "express";

export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({message: error.message});
            }
        });
    }

    generateCustomResponse(req, res, next) {
        res.sendSuccess = payload => res.status(200).json({status: 'Success', payload});
        res.sendError = (message, status = 400) => res.status(status).json({status: 'Error', message});
        res.sendTest = () => res.status(200).json({status: 'Test Success'});
        next();
    }

    get(path, ...callbacks) {
        this.router.get(path, this.generateCustomResponse, this.applyCallbacks(callbacks));
    }

    post(path, ...callbacks) {
        this.router.post(path, this.applyCallbacks(callbacks));
    }

    put(path, ...callbacks) {
        this.router.put(path, this.applyCallbacks(callbacks));
    }

    delete(path, ...callbacks) {
        this.router.delete(path, this.applyCallbacks(callbacks));
    }
}
