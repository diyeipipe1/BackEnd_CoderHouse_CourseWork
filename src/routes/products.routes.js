import express from "express";
import __dirname from '../utils.js'
import ProductManager from "../dao/filemanagers/ProductManager.js";
import ProductDBManager from "../dao/dbmanagers/ProductDBManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the product manager
const productManager = new ProductManager(__dirname+"/public/data/products.json")
const productDBManager = new ProductDBManager()

// Get all or Get limited number by query ?=limit 
router.get("/", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        let limit = req.query.limit || 10
        let page = req.query.page || 1
        let sort = req.query.sort 
        let query = req.query.query 

        // get the products (one is FileSystem and the other is Mongoose)
        //let products = await productManager.getProducts();
        let response = await productDBManager.getProducts(limit, page, sort, query);

        res.send(response)
    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: error.message}) 
    }
})

// Get by product ID
router.get("/:pid", async(req, res) => {
    try {
        let pid = req.params.pid

        // Get the product
        //const product = await productManager.getProductById(pid)
        const product = await productDBManager.getProductById(pid)

        // If we get null then the product with given id wasn't found
        if (!product){
            res.status(404).send({status: "NotFoundError", error: "product with param id not found"})
        }

        res.send(product)
    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: error.message})
    }
})

// Post product
router.post("/", async(req, res) => {
    try {
        let prodNew = req.body

        // Error checking, see if there's missing data
        if (prodNew.title && prodNew.description && prodNew.price && prodNew.thumbnail && 
            prodNew.code && prodNew.stock && prodNew.category){

            // Create product
            //const product = await productManager.addProduct(prodNew.title, prodNew.description, prodNew.price,
            //    prodNew.thumbnail, prodNew.code, prodNew.stock, prodNew.category, prodNew.status)
            const product = await productDBManager.addProduct(prodNew.title, prodNew.description, prodNew.price,
                prodNew.thumbnail, prodNew.code, prodNew.stock, prodNew.category, prodNew.status)
    
            // If we get something falsy then the product wasn't created correctly
            if (!product){
                res.status(400).send({status: "NotCreatedError", error: "there was an error creating the product"})
            }

            res.send(product)
        }else{
            return res.status(400).send({status: "BadRequest", error:"missing field or fields in request body"})
        }
    } catch (err) {
        // Error handling if the productManager sends an error
        return res.status(400).send({status:"BadRequest", error: err.message})
    }
})

// Put product
router.put("/:pid", async(req, res) => {
    try {
        let pid = req.params.pid
        let prodNew = req.body

        // Try to update the product with the class function
        //const prod = await productManager.updateProduct(pid, prodNew)
        const prod = await productDBManager.updateProduct(pid, prodNew)


        // If we get something falsy then the product wasn't updated correctly
        if (!prod){
            res.status(400).send({status: "NotUpdatedError", error: "there was an error updating the product"})
        }

        res.send(prod)

    } catch (err) {
        return res.status(404).send({status:"NotFoundError", error: err.message})
    }
})

// Delete product
router.delete("/:pid", async(req, res) => {
    try {
        let pid = req.params.pid
    
        // Try to delete the product with the class function
        //const verif = await productManager.deleteProduct(pid)
        const verif = await productDBManager.deleteProduct(pid)

        // If we get something falsy then the product wasn't deleted correctly
        if (!verif){
            res.status(400).send({status: "NotUpdatedError", error: "there was an error deleting the product"})
        }

        res.status(200).send({status:"Ok", error: "product deleted correctly"})

    } catch (err) {
        return res.status(404).send({status:"NotFoundError", error: err.message})
    }
})


// export the router
export default router;