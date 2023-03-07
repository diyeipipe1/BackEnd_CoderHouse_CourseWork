import express from "express";
import __dirname from '../utils.js'
import ProductManager from "../dao/filemanagers/ProductManager.js";
import ProductDBManager from "../dao/dbmanagers/ProductDBManager.js";
import CartDBManager from "../dao/dbmanagers/CartDBManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the product manager
const productManager = new ProductManager(__dirname+"/public/data/products.json")
const productDBManager = new ProductDBManager()
const cartDBManager = new CartDBManager()

// Login - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get("/", (req, res) => {
    req.session.destroy() // TODO: Check if necessary
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})


// Products - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Get all products
router.get("/all", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        // get the products
        let products = await productDBManager.getProducts(10,1,"","");

        let prods = products.payload

        res.render("home.handlebars", {prods})
    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
    }
})

// Get paginated products and add them to a cart
router.get("/products", async (req, res) => {
    try {
        let name = "default" // TODO: por ahora no se bloquea ruta sino se usa defaults
        let email = "defaultEmail"
        let role = "defaultRole"
        if (req.user){
            name = req.user.name
            email = req.user.email
            role = req.user.role
        }

        let limit = req.query.limit || 10
        let page = req.query.page || 1
        let sort = req.query.sort 
        let query = req.query.query 

        // get the products
        let response = await productDBManager.getProducts(limit, page, sort, query);

        let {payload, hasPrevPage, hasNextPage, prevLink, nextLink, pageNum} = response

        res.render("products", {
          payload,
          hasNextPage,
          hasPrevPage,
          nextLink,
          prevLink,
          pageNum, 
          name,
          email,
          role
        });
    } catch (err) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: err.message}) 
    }
});

// Get products from given cart
router.get("/carts/:cid", async(req, res) => {
    try {
        let cid = req.params.cid

        // get the wanted cart products
        let prods = await cartDBManager.getCartByIdPopulate(cid);

        // If we get null then the cart with given id wasn't found
        if (!prods){
            return res.status(404).send({status: "NotFoundError", error: "cart with param id not found"})
        }

        res.render("cart", {prods})

    } catch (err) {
        // Error handling if the cartManager sends an error
        return res.status(400).send({status:"InternalServerError", error: err.message})
    }
})


// Sockets - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Get all products in real time
router.get("/realtimeproducts", async(req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        // get the products
        let productRes = await productDBManager.getProducts(100,1,"","");

        let products = productRes.payload

        res.render("realTimeProducts.handlebars", {products})

    } catch (error) {
        // Error handling if the productManager sends an error
        return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
    }
})

// Chat application
router.get("/chat", async (req, res) => {
    res.render("chat.handlebars")
})



// export the router
export default router;