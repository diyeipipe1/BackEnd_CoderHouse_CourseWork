import {UserService} from "../repositories/index.repositories.js"
import MailerService from "../services/mailer.services.js"
import passport from "passport";
import jwt from 'jsonwebtoken';
import {createHash, isValidPassword} from "../utils.js"

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
            let email = ""
            if (req.session) {
                email = req.session.user.email;
                req.session.destroy();
            }
            if (req.user) {
                email = req.user.email;
                req.user = {}
            }
            
            await UserService.updateLastConnection(email)

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

    sendEmail = async(req, res) => {
        try {
            let email = req.body.email

            const userBool = await UserService.checkUser(email)

            if (userBool && userBool==true) {
                //Set up token 
                let token = jwt.sign({email}, "JWT_KEY", {expiresIn: "1h"});

                //Send mail
                const result = await MailerService.sendRecoveryMail({
                    from: "diazrochajuanfe@gmail.com",
                    to: email,
                    subject: "Recover password",
                    html: `
                    <div>
                        Click the button to reset your password
                        <br>  
                        (Link valid for 1 hour)
                        <br>
                        <a href="http://localhost:8080/resetPassword/${token}" style="background-color:#008CBA; border:none; color:white; padding: 12px 28px; text-align:center; text-decoration:none; display:inline-block; font-size:16px; margin:4px 2px; cursor:pointer;">Reset Password</a>
                    </div>
                    `,
                    attachments: []
                })

                if (result.accepted && result.accepted.length > 0){
                    return res.send({status:"success", payload: result, email: email})
                }
                return res.status(400).send({status:"BadRequest", error: "Error, email not sent"})
            }

            return res.status(400).send({status:"BadRequest", error: "No user with that Email"})
            
        } catch (err) {
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    restorePassword = async(req, res) => {
        try {
            let passwordNew = req.body.password;
            let email = req.headers.email;

            // Error checking, see if there's missing data
            if (passwordNew){
                // check user
                const user = await UserService.getUserByEmail(email)
    
                let passNewHash = createHash(passwordNew)
    
                // If we get something falsy then the user wasn't retrieved
                if (!user){
                    return res.status(400).send({status:"BadRequest", error: "error retrieving user"})
                }
    
                // The new password is compared to the old one, if they're the same, error
                if (isValidPassword(user, passwordNew)){
                    return res.send({status:"PreviousData", error: "password can't be the same as previous one"})
                }
    
                user.password = passNewHash

                const userUpdated = await UserService.updateUser(email, user)
    
                return res.status(200).send({status:"success", payload: userUpdated})
            }else{
                return res.status(400).send({status:"BadRequest", error: "password can not be empty"})
            }
        } catch (err) {
            return res.status(400).send({status:"BadRequest", error: err.message})
        }
    }

    updateMembership = async(req, res) => {
        try {
            let uid = req.params.uid
    
            // Try to update the user with the class function
            let user = await UserService.updateMembership(uid)
    
    
            // If we get something falsy then the user wasn't updated correctly
            if (!user){
                return res.status(400).send({status: "NotUpdatedError", error: "there was an error updating the user"})
            }
    
            res.send({status: "success", payload: user})
    
        } catch (err) {
            return res.status(404).send({status:"NotFoundError", error: err.message})
        }
    }
}