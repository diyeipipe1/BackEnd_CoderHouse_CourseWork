import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url); //Url a cadena de ruta

const __dirname = dirname(__filename);

export default __dirname;