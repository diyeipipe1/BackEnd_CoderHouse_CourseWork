import {CartService} from "../repositories/index.repositories.js"

// Create class for exporting Callback functions
export default class CartController{
    createNewCart = async(req, res) => {
        try {
            // Create cart
            //const cart = await cartManager.addCart()
            const cart = await CartService.addCart()
    
            // If we get something falsy then the cart wasn't created correctly
            if (!cart){
                return res.status(400).send({status: "NotCreatedError", error: "there was an error creating the cart"})
            }
    
            res.send(cart)
        } catch (err) {
            // Error handling if the productManager sends an error
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    getAllProducts = async(req, res) => {
        try {
            let cid = req.params.cid
    
            // get the wanted cart products
            //let products = await cartManager.getCartById(cid);
            let products = await CartService.getCartByIdPopulate(cid);
    
            // If we get null then the cart with given id wasn't found
            if (!products){
                return res.status(404).send({status: "NotFoundError", error: "cart with param id not found"})
            }
    
            res.send(products)
    
        } catch (err) {
            // Error handling if the cartManager sends an error
            return res.status(400).send({status:"InternalServerError", error: err.message})
        }
    }

    addQuantity = async(req, res) => {
        try {
            let pid = req.params.pid
            let cid = req.params.cid
            
            // Try to add quantity to the product with the class function
            //const verif = await cartManager.addProductForCart(cid, pid)
            const verif = await CartService.addProductForCart(cid, pid)
    
            // If we get something falsy then the product wasn't deleted correctly
            if (!verif){
                return res.status(400).send({status: "NotAddedError", error: "there was an error adding the product"})
            }
    
            res.status(200).send({status:"Ok", error: "product added correctly"})
        } catch (err) {
            return res.status(404).send({status:"CartNotFoundError", error: err.message})  
        }
    }

    updateProducts = async(req, res) => {
        try {
            let cid = req.params.cid
            let prodsNew = req.body
    
            // Try to elim product with the class function
            const prodsUpdated = await CartService.updateCart(cid, prodsNew)
    
            if (!prodsUpdated){
                return res.status(400).send({status: "NotUpdatedError", error: "there was an error updating the product"})
            }
    
            res.send(prodsUpdated)
        } catch (err) {
            return res.status(404).send({status:"CartNotFoundError", error: err.message})
        }
    }

    updateQuantity = async(req, res) => {
        try {
            let pid = req.params.pid
            let cid = req.params.cid
            let quantity = req.body.quantity
    
            // Try to elim product with the class function
            const prodUpdated = await CartService.updateCartProduct(cid, pid, quantity)
    
            if (!prodUpdated){
                return res.status(400).send({status: "NotUpdatedError", error: "there was an error updating the product"})
            }
    
            res.send(prodUpdated)   
        } catch (err) {
            return res.status(404).send({status:"CartNotFoundError", error: err.message})
        }
    }

    deleteProducts = async(req, res) => {
        try {
            let cid = req.params.cid
    
            // Try to elim product with the class function
            const cartUpdated = await CartService.deleteCart(cid)
    
            if (!cartUpdated){
                return res.status(400).send({status: "NotDeletedError", error: "there was an error deleting the products in the cart"})
            }
    
            res.send(cartUpdated)
        } catch (err) {
            return res.status(404).send({status:"CartNotFoundError", error: err.message})
        }
    }

    deleteProduct = async(req, res) => {
        try {
            let pid = req.params.pid
            let cid = req.params.cid
        
            // Try to elim product with the class function
            const verif = await CartService.deleteProductForCart(cid, pid)
    
            if (!verif){
                return res.status(400).send({status: "NotDeletedError", error: "there was an error deleting the product"})
            }
    
            res.status(200).send({status:"Ok", error: "product deleted correctly"})
        } catch (err) {
            return res.status(404).send({status:"CartNotFoundError", error: err.message})
        }
    }

    purchaseProduct = async(req, res) => {
        try {
            prodsCart = await this.getAllProducts(req, res) //TODO: THIS OR HTML REQUEST?
    
            if (!prodsCart.error) {
                //
            }else {
                return res.status(400).send({status:"Error", error: prodsCart.error})
            }
            
            // Use the getAllProductsto get list.. Qnty and stock
            // If
            //  Qnty>=Stock, restar del stock y continuar 
            //  Qnty<Stock No agregar el producto a compras, nada de compras parciales
            // Ticket create, before any actual update in case of code fail or catch that 
            // Carrito borrar prods comprados ok
            // Lista devuelta con prods no comprados
        } catch (err) {
            return res.status(404).send({status:"Error", error: err.message})

        }
    }
}