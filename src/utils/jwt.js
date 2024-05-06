import jwt from "jsonwebtoken";

const generateJWT = (user) => {
    let payload = { user: user.user };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

export default generateJWT;
export { verifyJWT };