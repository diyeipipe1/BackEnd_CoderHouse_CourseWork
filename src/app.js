import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from './utils.js'
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

// Bring the module
const app = express();

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'views'));

// Public
app.use(express.static(__dirname+"/public"))

// Bring the routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter)

// Raise the server
const httpServer = app.listen(8080, () => {console.log("Server raised")});
const socketServer = new Server(httpServer);

// Use a socket
const viewNameSpace = socketServer.of("/realtimeproducts");
export default viewNameSpace;



