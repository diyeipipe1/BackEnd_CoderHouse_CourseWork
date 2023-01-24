import express from "express";
import ProductManager from "../models/ProductManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the product manager
const productManager = new ProductManager("./src/products.json")

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
// export the router
export default router;