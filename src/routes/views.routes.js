import express from "express";
import handlebars from "express-handlebars";
import ProductManager from "../models/ProductManager.js";
import viewNameSpace from "../app.js"

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

// Get all products in real time
router.get("/realtimeproducts", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        // get the products
        let products = await productManager.getProducts();

        res.render("realTimeProducts.handlebars", {products})

        viewNameSpace.on("connection", socket => {
            socket.on("update", async _ => {
                // get the products
                let products = await productManager.getProducts();
                
                console.log(products)
                //socket.emit("updateList", products) 
                // TODO: Para luego, por ahora se muestra actualizacion en consola solo
            })
        })
    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
    }
})



// export the router
export default router;