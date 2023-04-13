import {CartService, ProductService} from "../repositories/index.repositories.js"

// Create class for exporting Callback functions
export default class ViewsController{
    login = (req, res) => {
        req.session.destroy() // TODO: Check if necessary
        res.render("login")
    }

    register = (req, res) => {
        res.render("register")
    }

    allProducts = async(req, res) => {
        // Try catch in case the number conversion of limit returns an error
        try {
            // get the products
            let products = await ProductService.getProducts(10,1,"","");
    
            let prods = products.payload
    
            res.render("home.handlebars", {prods})
        } catch (error) {
            // Error handling if the productManager sends an error
            return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
        }
    }

    pagProducts = async (req, res) => {
        try {
            
            // Defaults in case they don't arrive with github
            let name = "default"
            let email = "defaultEmail"
            let role = "user"
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
            let response = await ProductService.getProducts(limit, page, sort, query);
    
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
    }

    getProductsCart = async(req, res) => {
        try {
            let cid = req.params.cid
    
            // get the wanted cart products
            let prods = await CartService.getCartByIdPopulate(cid);
    
            // If we get null then the cart with given id wasn't found
            if (!prods){
                return res.status(404).send({status: "NotFoundError", error: "cart with param id not found"})
            }
    
            res.render("cart", {prods})
    
        } catch (err) {
            // Error handling if the cartManager sends an error
            return res.status(400).send({status:"InternalServerError", error: err.message})
        }
    }

    realTimeProducts = async(req, res) => {
        // Try catch in case the number conversion of limit returns an error
        try {
            // get the products
            let productRes = await ProductService.getProducts(100,1,"","");
    
            let products = productRes.payload
    
            res.render("realTimeProducts.handlebars", {products})
    
        } catch (error) {
            // Error handling if the productManager sends an error
            return res.status(500).send({status: "InternalServerError", error: "there was an error reading the data"}) 
        }
    }

    chat = async (req, res) => {
        res.render("chat.handlebars")
    }
}
