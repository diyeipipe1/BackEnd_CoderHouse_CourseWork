import express from "express";
import __dirname from '../utils.js'
import ViewsController from "../controllers/views.controller.js";
import {HandlePolicies} from "../utils.js"

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
// TODO: Add GoToChat button on /products
router.get("/chat",  HandlePolicies(['USER']), viewsController.chat)


// LoggerTest - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get("/loggerTest", viewsController.loggerTest)


// Recover Password - - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get("/recover", viewsController.recoverPassword)

// After link, reset the password  - - - - - - - - - - - - - - - - - - -
router.get("/resetPassword/:token", viewsController.resetPassword)

// export the router
export default router;