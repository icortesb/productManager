import { Router } from 'express';
import routerProducts from './products.routes.js';
import routerCarts from './carts.routes.js';
import routerChat from './chat.routes.js';
import routerSessions from './sessions.routes.js';
import routerViews from './views.routes.js';
import routerAuth from './auth.routes.js';

const router = new Router(); 

router.use('/api/products', routerProducts);
router.use('/api/carts', routerCarts);
router.use('/chat', routerChat);
router.use('/api/sessions', routerSessions);
router.use('/', routerViews);
router.use('/auth', routerAuth);

export default router;