import mongoose from 'mongoose';

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
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    }, 
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    }
})

export const UserModel = mongoose.model(userCollection, userSchema);