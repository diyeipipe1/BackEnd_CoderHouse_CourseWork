import UserRepository from "./users.repositories.js"
import UserDBManager from "../dao/dbmanagers/UserDBManager.js"
import CartRepository from "./carts.repositories.js"
import CartDBManager from "../dao/dbmanagers/CartDBManager.js"
import ProductRepository from "./products.repositories.js"
import ProductDBManager from "../dao/dbmanagers/ProductDBManager.js"
import TicketRepository from "./ticket.repositories.js"
import TicketDBManager from "../dao/dbmanagers/TicketDBManager.js"

// activate the user manager
const userDBManager = new UserDBManager()
const cartDBManager = new CartDBManager()
const productDBManager = new ProductDBManager()
const ticketDBManager = new TicketDBManager()

// Instance the repository with the DBManager and export it, repo has shell calls to Manager funcs
export const UserService = new UserRepository(userDBManager)
export const CartService = new CartRepository(cartDBManager)
export const ProductService = new ProductRepository(productDBManager)
export const TicketService = new TicketRepository(ticketDBManager)