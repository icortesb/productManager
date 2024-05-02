export const auth = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
}