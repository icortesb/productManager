import { Router } from 'express';
import rootDir from '../utils/dirname.js';
import routerProducts from './products.routes.js';
import routerCarts from './carts.routes.js';
import routerChat from './chat.routes.js';
import routerSessions from './sessions.routes.js';
import routerViews from './views.routes.js';
import routerAuth from './auth.routes.js';
import routerMail from './mail.routes.js';
import routerTwilio from './twilio.routes.js';
import routerMocks from './mocks.routes.js';
import routerUsers from './users.routes.js';
import Cart from '../dao/mongo/models/carts.model.js';
import User from '../dao/mongo/models/users.model.js';
import compressionRouter from './compression.routes.js';
import { addLogger } from '../utils/logger.js';

const router = new Router(); 

router.use(addLogger);
router.use('/api/products', routerProducts);
router.use('/api/carts', routerCarts);
router.use('/chat', routerChat);
router.use('/api/sessions', routerSessions);
router.use('/', routerViews);
router.use('/auth', routerAuth);
router.use('/mail', routerMail);
router.use('/twilio', routerTwilio);
router.use('/mocks', routerMocks);
router.use('/compression', compressionRouter);
router.use('/users', routerUsers);

router.use('/admin/deleteUsers', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).send({
            message: 'All users deleted',
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.use('/admin/deleteCarts', async (req, res) => {
    try {
        const result = await Cart.deleteMany({});
        res.status(200).send({
            message: 'All carts deleted',
            result: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.use('/failedRegister', (req, res) => {
    res.render('error')
});

router.use('*', (req, res) => {
    res.status(404).sendFile('public/404.html', { root: rootDir });
});

export default router;