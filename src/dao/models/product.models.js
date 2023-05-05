import mongoose from "mongoose";
import mongoosePgn from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: false
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersgit',
        default: "6454987266bf726397cc38a2"
    }
})

productSchema.plugin(mongoosePgn);

export const ProductModel = mongoose.model(productCollection, productSchema);