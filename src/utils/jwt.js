import jwt from "jsonwebtoken";

const generateJWT = (user) => {
    let payload = {};

    if (user.user === undefined || user.role === undefined) {
        payload = { user: user };
    } else {
        payload = { user: user.user, role: user.role, cart: user.cart };
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);


export default generateJWT;
export { verifyJWT };