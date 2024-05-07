import { verifyJWT } from "../utils/jwt.js";

export const authAdmin = async (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
}

export const verifyLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token && !req.session.user) {
        return res.redirect('/login');
    }
    const session = req.session;
    if (session.user) {
        req.user = session.user;
        return next();
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