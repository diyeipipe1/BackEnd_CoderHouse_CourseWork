import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from './utils.js'
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./dao/filemanagers/ProductManager.js";
import ProductDBManager from "./dao/dbmanagers/ProductDBManager.js";
import MessagesDBManager from "./dao/dbmanagers/MessagesDBManager.js";
import mongoose from "mongoose";

// Bring the module
const app = express();
app.use(express.json()); // Important to work with JSON

// Connect to mongoDB
mongoose.connect('mongodb+srv://diyeipipe:coderhouse123@coderhousecluster.hh51n5a.mongodb.net/?retryWrites=true&w=majority', (error) => {
    if (error){
        console.log(error)
        process.exit();
    }
})

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
const productManager = new ProductManager(__dirname+"/public/data/products.json")
const productDBManager = new ProductDBManager()
const messagesDBManager = new MessagesDBManager()
const viewNameSpace = socketServer.of("/realtimeproducts");
const chatNameSpace = socketServer.of('/chat');

// Socket set
viewNameSpace.on("connection", socket => {
    socket.on("update", async _ => {
        // Turn init false so the prodManger autoUpdates
        //productManager.init= false;
        // get the products
        let products = await productDBManager.getProducts(100,1,"","");
        // Go back to JavaScript with updated list
        socket.emit("updateList", products.payload) 
    })
})

// Messages to have in chat
let logsWSocketMessageUser = []
// When you hear a connection to me, check whats inside
chatNameSpace.on("connection", socket => {
    console.log("Tenemos un cliente conectado")

    // Listeners, this one also emits with the key messageLog
    socket.on("msg", async data => {
        try {
            await messagesDBManager.addMessage(data.user, data.message)
            logsWSocketMessageUser = await messagesDBManager.getMessages()
            chatNameSpace.emit('messageLog', logsWSocketMessageUser)
        } catch (error) {
          console.log(error)   
        }
    })

    //Get certain data and bounce it back to listeners with key newUserConnected
    socket.on("authenticated", data => {
        socket.broadcast.emit("newUserConnected", data);
    })

    //As soon as you connect, get the chat up
    socket.on("chatMake", async () =>{
        logsWSocketMessageUser = await messagesDBManager.getMessages()
        chatNameSpace.emit('chatMakeJS', logsWSocketMessageUser)
    })
})


export default viewNameSpace;



