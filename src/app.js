import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

// Bring the module
const app = express();

// Bring the routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Raise the server
app.listen(8080, () => {console.log("Server raised")});



