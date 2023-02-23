import {CartModel} from "../models/cart.models.js";
import mongoose from "mongoose";

export default class CartDBManager{
    // Create
    async addCart(){
        try {
            let cart = await CartModel.create({})

            // Return product added
            return cart
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getCartByIdPopulate(id){
        try {
            let cart = await CartModel.findById(id).populate('products.product');

            if (cart) {
                return cart.products
            }

            console.log("no carts with given ID")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // Read
    async getCartById(id){
        try {
            let cart = await CartModel.findById(id);
            if (cart) {
                return cart.products
            }

            console.log("no carts with given ID")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // Add stock for product
    async addProductForCart(cid, pid){
        try {
            let cart = await this.getCartById(cid)

            if (cart) {
                let done = false
                let cart = await CartModel.findOne({ _id: cid });
                let productIndex = cart.products.findIndex(p => {return p.product.equals(mongoose.Types.ObjectId(pid))});
                if (productIndex >= 0) {
                    cart.products[productIndex].quantity++;
                    done = true
                }else {
                    cart.products.push({ product: pid, quantity: 1 });
                    done = true
                }

                let result = await cart.save();
                console.log(result)


                // Return operation status
                return done
            }else {
                console.log('cart to add products to not found')
                throw new Error("no cart found with id given to add product")
            }

        } catch (error) {
            throw error
        }
        // si se añade uno existente aumentar, incrementar de a uno
    }

    // Update product list for cart
    async updateCart(cid, prodsNew){
        try {
            let cartAct = await this.getCartById(cid)
            if (cartAct){  
                // convert id to mongoose id object      
                const newProdsArray = prodsNew.map(prod => {
                    return { product: mongoose.Types.ObjectId(prod.product), quantity: prod.quantity };
                })

                let result = await CartModel.updateOne({_id:cid}, { $set: { products: newProdsArray }});
                console.log(result)
                
                if (result.modifiedCount >0){
                    let finalCart = await this.getCartById(cid)
                    return finalCart
                }else{
                    console.log('error updating cart')
                    throw new Error("error updating cart, data might be wrong type or same as current document")
                }
            }else{
                console.log('cart to update not found')
                throw new Error("no cart found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }

    // Update product quantity for cart
    async updateCartProduct(cid, pid, quantity){
        try {
            quantity = Number(quantity)
            if (!quantity){ throw new Error("the quantity is expected to be a number")}

            let cart = await this.getCartById(cid)

            if (cart) {
                let done = false
                let cart = await CartModel.findOne({ _id: cid });

                let productIndex = cart.products.findIndex(p => {return p.product.equals(mongoose.Types.ObjectId(pid))});
                if (productIndex >= 0) {
                    cart.products[productIndex].quantity = quantity
                    done = true
                }else {
                    throw new Error("no product with given id on cart")
                }

                let result = await cart.save();
                console.log(result)

                // Return operation status
                return result
            }else {
                console.log('cart to add products to not found')
                throw new Error("no cart found with id given to add product")
            }

        } catch (error) {
            throw error
        }
    }

    // Delete product list for cart
    async deleteCart(cid){
        try {
            let cartAct = await this.getCartById(cid)
            if (cartAct){
                let result = await CartModel.updateOne({_id:cid}, { $set: { products: [] }});
                console.log(result)
                
                let finalCart = await CartModel.findById(cid);
                return finalCart
            }else{
                console.log('cart to update not found')
                throw new Error("no cart found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }
    
    // Delete product for cart
    async deleteProductForCart(cid, pid){
        try {
            let cart = await this.getCartById(cid)

            if (cart) {
                let done = false
                let cart = await CartModel.findOne({ _id: cid });

                let productIndex = cart.products.findIndex(p => {return p.product.equals(mongoose.Types.ObjectId(pid))});
                if (productIndex >= 0) {
                    cart.products.splice(productIndex,1)
                    done = true
                }else {
                    throw new Error("no product with given id on cart")
                }

                let result = await cart.save();
                console.log(result)

                // Return operation status
                return done
            }else {
                console.log('cart to add products to not found')
                throw new Error("no cart found with id given to add product")
            }

        } catch (error) {
            throw error
        }
        // si se añade uno existente aumentar, incrementar de a uno
    }
}