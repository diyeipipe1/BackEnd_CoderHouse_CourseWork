import express from "express";
import __dirname from '../utils.js'
import ProductManager from "../dao/filemanagers/ProductManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the product manager
const productManager = new ProductManager(__dirname+"/public/data/products.json")

// Get all products
router.get("/", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        // get the products
        let products = await productManager.getProducts();

        res.render("home.handlebars", {products})
    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
    }
})

// Get all products in real time
router.get("/realtimeproducts", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        // get the products
        let products = await productManager.getProducts();

        res.render("realTimeProducts.handlebars", {products})

    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
    }
})



// export the router
export default router;