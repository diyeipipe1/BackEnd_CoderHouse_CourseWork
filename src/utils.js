import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';

export const createHash =password=> bcrypt.hashSync(password,bcrypt.genSaltSync(10)); //irrervertible
export const isValidPassword =(user, password)=>bcrypt.compareSync(password,user.password);

const __filename = fileURLToPath(import.meta.url); //Url a cadena de ruta
const __dirname = dirname(__filename);
export default __dirname;