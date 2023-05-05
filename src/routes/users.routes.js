import express from "express";
import UsersController from "../controllers/users.controller.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate controller
const usersController = new UsersController()

// Use passport to register user
router.post('/register', usersController.passportAuthRegister, usersController.authRegister)

// Log in user
router.post('/login', usersController.passportAuthLogin, usersController.authLogin)

// Logout page
router.get("/logout", usersController.authLogout)

// Activates github verification with third party
router.get('/github', usersController.passportGitHub)

// After github login, this is the route that user is redirected to
router.get('/githubcalls', usersController.passportGitHubCallback, usersController.authGitHubCallback)

// Show current user
router.get('/current', usersController.authCurrent)

// Try to send recovery email if user exists
router.post('/sendemail', usersController.sendEmail)

// Send password to recover
router.post('/restorepassword', usersController.restorePassword)


// export the router
export default router;