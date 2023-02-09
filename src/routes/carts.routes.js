import express from "express";
import __dirname from '../utils.js'
import CartManager from "../dao/filemanagers/CartManager.js";
import CartDBManager from "../dao/dbmanagers/CartDBManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the cart manager
const cartManager = new CartManager(__dirname+"/public/data/carrito.json")
const cartDBManager = new CartDBManager()

// Create new cart
router.post("/", async(req, res) => {
    try {
        // Create cart
        //const cart = await cartManager.addCart()
        const cart = await cartDBManager.addCart()

        // If we get something falsy then the cart wasn't created correctly
        if (!cart){
            res.status(400).send({status: "NotCreatedError", error: "there was an error creating the cart"})
        }

        res.send(cart)
    } catch (err) {
        // Error handling if the productManager sends an error
        return res.status(400).send({status:"BadRequest", error: err.message})
    }
})


// Get all products from given cart
router.get("/:cid", async(req, res) => {
    try {
        let cid = req.params.cid

        // get the wanted cart products
        //let products = await cartManager.getCartById(cid);
        let products = await cartDBManager.getCartById(cid);

        // If we get null then the cart with given id wasn't found
        if (!products){
            res.status(404).send({status: "NotFoundError", error: "cart with param id not found"})
        }

        res.send(products)

    } catch (err) {
        // Error handling if the cartManager sends an error
        return res.status(400).send({status:"InternalServerError", error: err.message})
    }
})

// Add quantity to a product
router.post("/:cid/product/:pid", async(req, res) => {
    try {
        let pid = req.params.pid
        let cid = req.params.cid
        
        // Try to add quantity to the product with the class function
        //const verif = await cartManager.addProductForCart(cid, pid)
        const verif = await cartDBManager.addProductForCart(cid, pid)

        // If we get something falsy then the product wasn't deleted correctly
        if (!verif){
            res.status(400).send({status: "NotAddedError", error: "there was an error adding the product"})
        }

        res.status(200).send({status:"Ok", error: "product added correctly"})
    } catch (err) {
        return res.status(404).send({status:"CartNotFoundError", error: err.message})  
    }
})

// export the router
export default router;

