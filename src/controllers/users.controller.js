import {UserService} from "../repositories/index.repositories.js"
import passport from "passport";

// Create class for exporting Callback functions
export default class UsersController{
    passportAuthRegister = passport.authenticate('register', {session: true})
    authRegister = async(req, res) => {
        try {
            if (req.user.errorMess) {
                //TODO: Catch passport error
                throw new Error(req.user.errorMess)
            }
            res.send({status: "success", payload: req.user})
        } catch (err) {
            // Error handling if the userDBManager sends an error
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    passportAuthLogin = passport.authenticate('login', {session: true})
    authLogin = async(req, res) => {
        try {
            if (req.user.errorMess) {
                throw new Error(req.user.errorMess)
            }

            // Add to session
            req.session.user = req.user

            res.send({status: "success", payload: req.user})
        } catch (err) {
            // Error handling if the userDBManager sends an error
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    authLogout = async (req, res) => {
        try {
            if (req.session) req.session.destroy();
            if (req.user) req.user = {}
            req.logger.info("Logout well done")
            res.send("logout success!"); 
        } catch (err) {
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    passportGitHub = passport.authenticate('github',{scope:['user:email']},async(req,res)=>{})

    passportGitHubCallback = passport.authenticate('github', {failureRedirect:'/register'})
    authGitHubCallback = async(req,res)=>{
        req.session.user =req.user,
        console.log(req.user)
        res.redirect('../../products');
    }
    
    authCurrent = (req, res) => {
        try {
            if (req.session.user){ 
                return res.send({status:"Ok", payload: UserService.getUserCurrent(req.session.user)})
            }
            res.status(400).send({status:"BadRequest", error: "No logged used"})
    
        } catch (err) {
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }
}