import jwt from "jsonwebtoken";

const SECRET_KEY = "Coder123";
const generateJWT = (user) => {
    let payload = { user: user.user };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

const verifyJWT = (token) => jwt.verify(token, SECRET_KEY);

export default generateJWT;
export { verifyJWT };