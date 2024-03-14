export const auth = (req, res, next) => {

    if(!req.headers["Authorization"]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({message: "No autorizado"});
    }

    let token = req.headers["Authorization"].split(' ')[1];
    next();
}