import { verifyJWT } from "../utils/jwt.js";

export const authAdmin = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }
    try {
        const decodedToken = verifyJWT(token);
        if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "No autorizado" });
        }
        next();
    } catch (error) {
        console.error("Error during login:", error);
        res.status(401).json({ message: "Invalid token" });
    }

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