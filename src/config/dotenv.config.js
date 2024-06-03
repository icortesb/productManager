import dotenv from 'dotenv';
import __dirname from '../utils/dirname.js';

dotenv.config({
    path: `${__dirname}/.env`
});

export default process.env;

