import express from "express";

// Bring the module
const router = express.Router();

// Get all or Get limited number by query ?=limit 
router.get("/", async(req, res) => {
    res.render("home.handlebars")
})

// export the router
export default router;