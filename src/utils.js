import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import {faker} from '@faker-js/faker';
import {ErrorCodes} from './errors.js';
import winston from 'winston';

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


// Role verification
export const HandlePolicies = (policies) => async(req, res, next) => {
    try {
        if (policies[0]==="PUBLIC") return next();
    
        let user = {}
        await fetch("http://localhost:8080/api/session/current", {headers: req.headers})
            .then(response => response.json())
            .then(data => user = data)

        if (user.error){
            return res.status(400).send({status: "AuthError", error: user.error}) 
        }

        if(!policies.includes(user.payload.role.toUpperCase())) return res.status(401).send({status: "UnauthorizedError", error: "endpoint not allowed for user role"})
        next();
    } catch (error) {
        return res.status(400).send({status: "AuthError", error: error.message})
    }
} 

// Mock Products
faker.locale= 'es';
const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys', 'Beauty', 'Food', 'Sports']
export const GenerateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl(),
        code: faker.datatype.uuid(),
        stock: faker.datatype.number({min:1, max: 100}),
        category: faker.helpers.arrayElement(categories),
        status: true
    }
}

// Error Middleware
export const ErrorHandler = (error, req, res, next) => {
    // TODO: All the same, unless special treatment ocurrs, this could be simplified
    // TODO: Elim custom error if not needed for final hand in
    switch (error.code){
        case ErrorCodes.MISSING_DATA:
            return res.status(error.statusCode).send({status: "error", error: error.name, details: error.cause || error.message });
        case ErrorCodes.NOT_CREATED:
            return res.status(error.statusCode).send({status: "error", error: error.name, details: error.cause || error.message});
        case ErrorCodes.MISSING_DATA:
            return res.status(error.statusCode).send({status: "error", error: error.name, details: error.cause || error.message});
        case ErrorCodes.INTERNAL_SERVER:
            return res.status(error.statusCode).send({status: "error", error: error.name, details: error.cause || error.message});
        case ErrorCodes.NOT_FOUND:
            return res.status(error.statusCode).send({status: "error", error: error.name, details: error.cause || error.message});
        default:
            return res.status(error.statusCode || 400).send({status: "error", error: error.name || "UncaughtError", error: error.message || error.cause});
    }
}


// Logger
const customLevels = {
    levels: {
        fatal:   0,
        error:   1,
        warning: 2,
        info:    3,
        debug:   4,
    },
    colors: {
        fatal:   'red',
        error:   'yellow',
        warning: 'green',
        info:    'blue',
        debug:   'white',
    },
}

const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevels.colors}),
                winston.format.simple()
            )
        }), 
        new winston.transports.File({
            level: 'error',
            format: winston.format.simple(),
            filename: './errors.log'
        }), 
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
}

// Date with format
export const getCurrentFormattedDate = () => {
    let date = new Date();
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second:'2-digit',
      hour12: false,
      timeZone: 'America/New_York'
    });
}

