import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Hash passwords 
export const createHash =password=> bcrypt.hashSync(password,bcrypt.genSaltSync(10)); //irrervertible
export const isValidPassword =(user, password)=>bcrypt.compareSync(password,user.password);

// env extract
dotenv.config(); 
export const MongoConnection = process.env.MONGO_CONNECTION;
export const Port = process.env.PORT;
export const SessionSecret = process.env.SESSION_SECRET;
export const ClientSecret = process.env.CLIENT_SECRET;

// File paths
const __filename = fileURLToPath(import.meta.url); //Url a cadena de ruta
const __dirname = dirname(__filename);
export default __dirname;

