import express from "express";
import __dirname from '../utils.js'
import CartController from "../controllers/carts.controller.js"
import {HandlePolicies} from "../utils.js"

//TODO: Create simple erase cart by ID

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the cart manager
//const cartManager = new CartManager(__dirname+"/public/data/carrito.json")

// activate controller
const cartController = new CartController()

// Create new cart
router.post("/", cartController.createNewCart)

// Get all products from given cart
router.get("/:cid", cartController.getAllProducts)

// Add quantity to a product
router.post("/:cid/product/:pid", HandlePolicies(['USER','PREMIUM']), cartController.addQuantity)

// Update whole product list 
router.put("/:cid", cartController.updateProducts)

// Update quantity of product 
router.put("/:cid/product/:pid", cartController.updateQuantity)

// Delete products from cart 
router.delete("/:cid", cartController.deleteProducts) 

// Delete product from cart
router.delete("/:cid/product/:pid", cartController.deleteProduct)

// Purchase product from cart
router.get("/:cid/purchase", cartController.purchaseProduct)

// export the router
export default router;

