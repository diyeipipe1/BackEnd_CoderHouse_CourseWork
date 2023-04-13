import {ProductService} from "../repositories/index.repositories.js";

// Create class for exporting Callback functions
export default class ProductController{
    getProducts = async(req, res) => {
        // Try catch in case the number conversion of limit returns an error
        try {
            let limit = req.query.limit || 10
            let page = req.query.page || 1
            let sort = req.query.sort 
            let query = req.query.query 
    
            // get the products (one is FileSystem and the other is Mongoose)
            //let products = await productManager.getProducts();
            let response = await ProductService.getProducts(limit, page, sort, query);
    
            res.send(response)
        } catch (error) {
            // Error handling if the productManager sends an error
            return res.status(500).send({status: "InternalServerError", error: error.message}) 
        }
    }

    getProductById = async(req, res) => {
        try {
            let pid = req.params.pid
    
            // Get the product
            //const product = await productManager.getProductById(pid)
            const product = await ProductService.getProductById(pid)
    
            // If we get null then the product with given id wasn't found
            if (!product){
                return res.status(404).send({status: "NotFoundError", error: "product with param id not found"})
            }
    
            res.send(product)
        } catch (error) {
            // Error handling if the productManager sends an error
            return res.status(500).send({status: "InternalServerError", error: error.message})
        }
    }

    createProduct = async(req, res) => {
        try {
            let prodNew = req.body
    
            // Error checking, see if there's missing data
            if (prodNew.title && prodNew.description && prodNew.price && prodNew.thumbnail && 
                prodNew.code && prodNew.stock && prodNew.category){
    
                // Create product
                //const product = await productManager.addProduct(prodNew.title, prodNew.description, prodNew.price,
                //    prodNew.thumbnail, prodNew.code, prodNew.stock, prodNew.category, prodNew.status)
                const product = await ProductService.addProduct(prodNew.title, prodNew.description, prodNew.price,
                    prodNew.thumbnail, prodNew.code, prodNew.stock, prodNew.category, prodNew.status)
        
                // If we get something falsy then the product wasn't created correctly
                if (!product){
                    return res.status(400).send({status: "NotCreatedError", error: "there was an error creating the product"})
                }
    
                res.send(product)
            }else{
                return res.status(400).send({status: "BadRequest", error:"missing field or fields in request body"})
            }
        } catch (err) {
            // Error handling if the productManager sends an error
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    updateProduct = async(req, res) => {
        try {
            let pid = req.params.pid
            let prodNew = req.body
    
            // Try to update the product with the class function
            //const prod = await productManager.updateProduct(pid, prodNew)
            const prod = await ProductService.updateProduct(pid, prodNew)
    
    
            // If we get something falsy then the product wasn't updated correctly
            if (!prod){
                return res.status(400).send({status: "NotUpdatedError", error: "there was an error updating the product"})
            }
    
            res.send(prod)
    
        } catch (err) {
            return res.status(404).send({status:"NotFoundError", error: err.message})
        }
    }

    deleteProduct = async(req, res) => {
        try {
            let pid = req.params.pid
        
            // Try to delete the product with the class function
            //const verif = await productManager.deleteProduct(pid)
            const verif = await ProductService.deleteProduct(pid)
    
            // If we get something falsy then the product wasn't deleted correctly
            if (!verif){
                return res.status(400).send({status: "NotUpdatedError", error: "there was an error deleting the product"})
            }
    
            res.status(200).send({status:"Ok", error: "product deleted correctly"})
    
        } catch (err) {
            return res.status(404).send({status:"NotFoundError", error: err.message})
        }
    }
}