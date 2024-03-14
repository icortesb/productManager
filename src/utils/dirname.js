import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { jwt } from "jsonwebtoken";


const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(resolve(__filename, '../'));

export default rootDir;

const SECRET_KEY = "Coder123"
export const generateJWT = (user) => jwt.sign(user, SECRET_KEY, {expiresIn: '1h'});
export const verifyJWT = (token) => jwt.verify(token, SECRET_KEY);