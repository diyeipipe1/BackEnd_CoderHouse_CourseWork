import express from "express";
import UserDBManager from "../dao/dbmanagers/UserDBManager.js";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the user manager
const userDBManager = new UserDBManager()


router.post('/register', async(req, res) => {
    try {
        let userNew = req.body

        // Error checking, see if there's missing data
        if (userNew.first_name && userNew.last_name && userNew.email && 
            userNew.age && userNew.password){

            // Check for user existence
            const exists = await userDBManager.checkUser(userNew.email)
            if (exists) {
                return res.status(400).send({status: "UserExistsError", error: "user email already registered"})
            }

            // Create user
            const user = await userDBManager.registerUser(userNew.first_name, userNew.last_name, userNew.email, 
                userNew.age, userNew.password)
    
            // If we get something falsy then the user wasn't created correctly
            if (!user){
                return res.status(400).send({status: "NotCreatedError", error: "there was an error registering the user"})
            }

            res.send({status:"success", payload: user})
        }else{
            return res.status(400).send({status: "BadRequest", error:"missing field or fields in request body"})
        }
    } catch (err) {
        // Error handling if the userDBManager sends an error
        return res.status(400).send({status:"BadRequest", error: err.message})
    }
})

router.post('/login', async(req, res) => {
    try {
        let userLog = req.body

        // Error checking, see if there's missing data
        if (userLog.email && userLog.password){
            // login user
            const user = await userDBManager.loginUser(userLog.email, userLog.password)

            // If we get something falsy then the user wasn't created correctly
            if (!user){
                return res.status(400).send({status: "NotLoggedError", error: "email or password invalid"})
            }

            req.session.user = {
                id: user._id,
                name: user.first_name,
                email:user.email,
                role: user.role
            }

            res.send({status:"success", message: "Successful login"})
        }else{
            return res.status(400).send({status: "BadRequest", error:"missing field or fields in request body"})
        }
    } catch (err) {
        // Error handling if the userDBManager sends an error
        return res.status(400).send({status:"BadRequest", error: err.message})
    }
})

// export the router
export default router;