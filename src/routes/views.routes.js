import express from "express";
import __dirname from '../utils.js'
import ViewsController from "../controllers/views.controller.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate controller
const viewsController = new ViewsController()

// Login - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get("/", viewsController.login)

router.get("/register", viewsController.register)


// Products - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Get all products
router.get("/all", viewsController.allProducts)

// Get paginated products and add them to a cart
router.get("/products", viewsController.pagProducts);

// Get products from given cart
router.get("/carts/:cid", viewsController.getProductsCart)


// Sockets - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Get all products in real time
router.get("/realtimeproducts", viewsController.realTimeProducts)

// Chat application
router.get("/chat", viewsController.chat)



// export the router
export default router;