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

                // Add to session
                req.session.user = req.user

                res.send({status: "success", payload: req.user})
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

router.get('/github',
    passport.authenticate('github',{scope:['user:email']},async(req,res)=>{})
)

router.get('/githubcalls',
    passport.authenticate('github', {failureRedirect:'/register'}),
    async(req,res)=>{
        req.session.user =req.user,
        console.log(req.user)
        res.redirect('../../products');
})


// export the router
export default router;