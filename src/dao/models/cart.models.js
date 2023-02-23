import mongoose from "mongoose";

const cartCollection = "carts";

// An array of objects with the key id and the key quantity
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

export const CartModel = mongoose.model(cartCollection, cartSchema);