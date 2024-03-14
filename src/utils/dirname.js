import { fileURLToPath } from "url";
import { dirname } from "path";
import { Jwt } from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const SECRET_KEY = "Coder123"
export const generateJWT = (user) => jwt.sign(user, SECRET_KEY, {expiresIn: '1h'})
export const verifyJWT = (token) => jwt.verify(token, SECRET_KEY)