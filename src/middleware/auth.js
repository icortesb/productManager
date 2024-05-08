import { verifyJWT } from "../utils/jwt.js";

export const authRole = (role) => async (req, res, next) => {
    const userRole = req.user[0].role;
    console.log('userRole:', userRole);
    if (userRole !== role) {
        console.log(`No tienes permiso para acceder a esta ruta como ${userRole}.`)
        return res.status(403).send(`No tienes permiso para acceder a esta ruta como ${userRole}.`);
    } else {
        console.log(`Tienes permiso para acceder a esta ruta como ${userRole}.`);
    }
    next();
}


export const verifyLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token && !req.session.user) {
        return res.redirect('/login');
    }
    try {
        const decodedToken = verifyJWT(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}