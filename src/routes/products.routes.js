import express from "express";
import __dirname from '../utils.js'
import ProductController from "../controllers/products.controller.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate controller
const productController = new ProductController()

// Get all or Get limited number by query ?=limit 
router.get("/", productController.getProducts)

// Get by product ID
router.get("/:pid", productController.getProductById)

// Post product
router.post("/", productController.createProduct)

// Put product
router.put("/:pid", productController.updateProduct)

// Delete product
router.delete("/:pid", productController.deleteProduct)


// export the router
export default router;