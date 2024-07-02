import Router from 'express';
import { UserManager } from '../dao/mongo/controllers/userManager.js';

const userManager = new UserManager();
const routerUsers = Router();

routerUsers.get('/getRoles', (req, res) => {
    userManager.getUserRoles().then((roles) => {
        res.status(200).json(roles);
    });
});

routerUsers.put('/premium/:uid', (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;
    userManager.changeUserRole(uid, role).then((result) => {
        res.status(200).json(result);
    });
});

export default routerUsers;

