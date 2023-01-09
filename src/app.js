import express from "express";
import ProductManager from "./ProductManager.js";

// Bring the module
const app = express();

// To read the JSON correctly
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// activate the product manager
const productManager = new ProductManager("./products.json")

app.get("/products", async (req, res) => {
    // Try catch in case the number conversion of limit returns an error
    try {
        let limit = req.query.limit
        
        // get the products
        let products = await productManager.getProducts();

        // If a limit was sent by query, limit the products shown
        if (limit){
            limit = Number(limit)
            products = products.slice(0, limit) //FOK
        }

        res.send(products)
    } catch (error) {
        // If the error was the conversion tell me, or if it came all the way from get products tooo
        if (limit){
            return res.status(404).send({status: "QueryError", error: "the query is expected to have a number"}) 
        }else{
            return res.status(500).send({status: "InternalServerErro", error: "there was an error reading the data"}) 
        }
    }
})


// Raise the server
app.listen(8080, () => {console.log("I've been awoken :O")})