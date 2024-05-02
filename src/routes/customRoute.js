import Router from './customRouter.js';
export default class customRoute extends Router {
    init() {
        this.get('/test', (req, res) => {
            res.sendSuccess('Test Success')
        });
    }
}

