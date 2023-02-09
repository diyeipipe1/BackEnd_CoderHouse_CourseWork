import {ProductModel} from "../models/product.models.js";

export default class ProductDBManager{
    // Create
    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        try {
            // If no status was sent, set as true
            status = typeof status !== 'undefined' ? status : true;

            let product = ProductModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status
            })

            // Return product added
            return product
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getProducts() {
        try {
            // find gets you all the documents in a collection, this case the collection in the product model
            let products = await ProductModel.find();

            return products
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getProductById(id){
        try {
            let product = await ProductModel.findById(id);
            if (product) {
                return product
            }

            console.log("no products with given ID")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // Update 
    async updateProduct(id, productNew){
        try {
            let productAct = await this.getProductById(id)
            if (productAct){
                let result = await ProductModel.updateOne({_id:id}, productNew);
                console.log(result)
                
                if (result.modifiedCount >0){
                    let finalProduct = await this.getProductById(id)
                    return finalProduct
                }else{
                    console.log('error updating product')
                    throw new Error("error updating product, data might be wrong type or same as current document")
                }
            }else{
                console.log('product to update not found')
                throw new Error("no product found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }

    // Delete
    async deleteProduct(id) {
        try {
            let product = await this.getProductById(id)
            if (product) {
                let result = await ProductModel.deleteOne({_id:id})

                if (result.deletedCount === 1){
                    return true
                } else{
                    console.log('error deleting product')
                    throw new Error("product was not deleted")
                }
            } else {
                console.log('product to delete not found')
                throw new Error("no product found with id given to delete")
            }
        } catch (error) {
            throw error
        }
    }
}