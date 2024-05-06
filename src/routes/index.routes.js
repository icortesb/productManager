import { Router } from 'express';
import routerProducts from './products.routes.js';
import routerCarts from './carts.routes.js';
import routerChat from './chat.routes.js';
import routerSessions from './sessions.routes.js';
import routerViews from './views.routes.js';
import routerAuth from './auth.routes.js';
import rootDir from '../utils/dirname.js';

const router = new Router(); 

router.use('/api/products', routerProducts);
router.use('/api/carts', routerCarts);
router.use('/chat', routerChat);
router.use('/api/sessions', routerSessions);
router.use('/', routerViews);
router.use('/auth', routerAuth);
router.use('*', (req, res) => {
    res.status(404).sendFile('public/404.html', { root: rootDir });
});

export default router;