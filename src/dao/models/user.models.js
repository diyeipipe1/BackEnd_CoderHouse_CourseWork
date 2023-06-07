import mongoose from 'mongoose';
import {getCurrentFormattedDate} from "../../utils.js"

const userCollection = 'usersgit';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user',
        required: true
    }, 
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    },
    documents: [
        {
          name: { type: String },
          reference: { type: String }
        }
    ],
    last_connection: { 
        type: Date, 
        default: getCurrentFormattedDate
    }
})

export const UserModel = mongoose.model(userCollection, userSchema);