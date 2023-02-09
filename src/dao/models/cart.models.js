import mongoose from "mongoose";

const cartCollection = "carts";

// An array of objects with the key id and the key quantity
const cartSchema = new mongoose.Schema({
    products: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

export const cartModel = mongoose.model(cartCollection, cartSchema);