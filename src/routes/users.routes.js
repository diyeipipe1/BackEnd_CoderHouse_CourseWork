import express from "express";
import UserDBManager from "../dao/dbmanagers/UserDBManager.js";
import passport from "passport";

// Bring the module
const router = express.Router();

// To read the JSON correctly
router.use(express.json())
router.use(express.urlencoded({extended: true}))

// activate the user manager
const userDBManager = new UserDBManager()

router.post('/register', 
    passport.authenticate(
        'register', 
        {session: true}),
        async(req, res) => {
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
)

router.post('/login', 
    passport.authenticate(
        'login', 
        {session: true}),
        async(req, res) => {
            try {
                if (req.user.errorMess) {
                    //TODO: Catch passport error
                    throw new Error(req.user.errorMess)
                }

                console.log(req.session)

                req.session.user = {
                    id: user._id,
                    name: user.first_name,
                    email:user.email,
                    role: user.role
                }

                console.log(req.session)

                res.send({status: "success", payload: req.session.user})
            } catch (err) {
                // Error handling if the userDBManager sends an error
                return res.status(400).send({status:"BadRequest", error: err.message})
            }
        }
)

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy();
        req.user.destroy();
        console.log("Logout well done")
        res.send("logout success!");
    } catch (err) {
        return res.status(400).send({status:"BadRequest", error: err.message})
    }
})

// export the router
export default router;