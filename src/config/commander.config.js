import { Command } from 'commander';
import dotenvConfig from './dotenv.config.js'

const program = new Command();
program
.option('-p, --port <number>', 'Puerto del servidor', 8080)
.option('-dev, --dev', 'Modo desarrollo', false);

program.parse();

const environment = program.opts().dev ? 'development' : 'prod';

const PORT = environment === 'development' ? dotenvConfig.PORT_DEV : dotenvConfig.PORT_PROD;
export { environment, PORT };