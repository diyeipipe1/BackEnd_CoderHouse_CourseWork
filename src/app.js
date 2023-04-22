import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname,{MongoConnection, Port, SessionSecret, ErrorHandler, addLogger} from './utils.js';
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import userRouter from "./routes/users.routes.js";
import viewsRouter from "./routes/views.routes.js";
//import ProductManager from "./dao/filemanagers/ProductManager.js";
import {ProductService} from "./repositories/index.repositories.js";
import MessagesDBManager from "./dao/dbmanagers/MessagesDBManager.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import initPassport from "./config/passport.config.js";

// Bring the module
const app = express();
app.use(express.json()); // Important to work with JSON

// Logger
app.use(addLogger)

// Connect to mongoDB
mongoose.connect(MongoConnection, (error) => {
    if (error){
        console.log(error)
        process.exit();
    }
})

// Use sessions
app.use(session({
    store:MongoStore.create({
        mongoUrl:MongoConnection,
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:20
    }),
    secret:SessionSecret,
    resave:false,
    saveUninitialized:false
}))

// Passport
initPassport();

app.use(passport.session());
app.use(passport.initialize());

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
app.use('/api/session',userRouter);
app.use('/', viewsRouter)

// Raise the server
const httpServer = app.listen(parseInt(Port), () => {console.log("Server raised")});
const socketServer = new Server(httpServer);

// Use a socket
//const productManager = new ProductManager(__dirname+"/public/data/products.json")
const messagesDBManager = new MessagesDBManager()
const viewNameSpace = socketServer.of("/realtimeproducts");
const chatNameSpace = socketServer.of('/chat');

// Socket set
viewNameSpace.on("connection", socket => {
    socket.on("update", async _ => {
        // Turn init false so the prodManger autoUpdates
        //productManager.init= false;
        // get the products
        let products = await ProductService.getProducts(100,1,"","");
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

app.use(ErrorHandler)

export default viewNameSpace;



