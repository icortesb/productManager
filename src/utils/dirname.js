import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(resolve(__filename, '../'));

export default rootDir;