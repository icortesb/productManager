export const authAdmin = async (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
}
