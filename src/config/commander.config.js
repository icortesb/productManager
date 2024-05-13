import { Command } from 'commander';
import dotenv from 'dotenv';
import __dirname from '../utils/dirname';

const program = new Command();
program
.option('-p, --port <number>', 'Puerto del servidor', 8080)
.option('-dev, --dev', 'Modo desarrollo', false);

program.parse();

const enviroment = program.opts().dev ? 'dev' : 'prod';
console.log(`Modo ${enviroment}`);

dotenv.config({
    path: `${__dirname}/.env`
});

console.log(`Usando el .env de ${enviroment}`);

const PORT = enviroment === 'dev' ? process.env.PORT_DEV : process.env.PORT_PROD;

export default {
    PORT,
    enviroment,
    program,
    dotenv
}