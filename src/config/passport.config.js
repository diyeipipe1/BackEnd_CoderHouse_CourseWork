import passport from "passport";
import local from "passport-local";
import UserDBManager from "../dao/dbmanagers/UserDBManager.js";
import CartDBManager from "../dao/dbmanagers/CartDBManager.js";
import {createHash, isValidPassword, ClientSecret} from "../utils.js"
import githubService from 'passport-github2';

// activate the user manager
const userDBManager = new UserDBManager()
const cartDBManager = new CartDBManager()


const localStrategy = local.Strategy;
const initPassport = () => {
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req, username, pass, done) => {
            try {
                let userNew = req.body;
                if (userNew.first_name && userNew.last_name && userNew.email && 
                    userNew.age && userNew.password){
                    
                    // Check for user existence
                    const exists = await userDBManager.checkUser(userNew.email)
                    if (exists) {
                        return done(null, {_id:0, errorMess:"user email already registered"})
                    }

                    // Create cart
                    const cart = await cartDBManager.addCart()
    
                    // Create user
                    const user = await userDBManager.registerUser(userNew.first_name, userNew.last_name, userNew.email, 
                        userNew.age, createHash(userNew.password), cart.id)
    
                    // If we get something falsy then the user wasn't created correctly
                    if (!user || !cart){
                        return done(null, {_id:0, errorMess:"there was an error registering the user"})
                    }
    
                    return done(null, user)
                }else{
                    return done(null, {_id:0, errorMess:"missing field or fields in request body"})
                }
            } catch (error) {
                return done (null, {_id:0, errorMess:error.message})
            }
        }
    ));

    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req, username, password, done) => {
            try {
                let userLog = req.body
        
                // Error checking, see if there's missing data
                if (userLog.email && userLog.password){
                    // login user
                    const user = await userDBManager.getUserByEmail(userLog.email)
        
                    // If we get something falsy then the user wasn't created correctly
                    if (!isValidPassword(user, userLog.password)){
                        return done(null, {_id:0, errorMess:"email or password invalid"})
                    }
        
                    done(null, user)
                }else{
                    return done(null, {_id:0, errorMess:"missing field or fields in request body"})
                }
            } catch (err) {
                // Error handling if the userDBManager sends an error
                return done (null, {_id:0, errorMess:error.message})
            }
        }
    ));

    passport.use('github', 
    new githubService({
        clientID: 'Iv1.0c3c778011be3bb0',
        clientSecret: ClientSecret,
        callbackURL: 'http://localhost:8080/api/session/githubcalls'
    }, async (accessToken,refreshToken,profile, done)=> {
        try{
            let user = await userDBManager.getUserByEmail(profile._json.email)
            if(!user){
                let userNew = {
                    first_name: profile._json.name || "no_name",
                    last_name: profile._json.last_name || "no_last_name",
                    age: 18,
                    email: profile._json.email,
                    password:''
                }

                // Create cart
                const cart = await cartDBManager.addCart()

                // Create user
                const userCreat = await userDBManager.registerUser(userNew.first_name, userNew.last_name, userNew.email, 
                    userNew.age, createHash(userNew.password), cart.id)

                // If we get something falsy then the user wasn't created correctly
                if (!userCreat){
                    return done(null, {_id:0, errorMess:"there was an error registering the user"})
                }

                done(null,userCreat)
            }else{
                done(null,user)
            }
        }catch(error){
            return done (null, {_id:0, errorMess:error.message})
        }
    }))

    // Return here to serialize (Cookies and inique identifier)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async(id, done) => {
        let user = await userDBManager.getUserById(id)
        done(null, user);
    })
}

export default initPassport;