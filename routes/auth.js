import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";

const router = express.Router()

// create a user
router.post("/sign-up", signup)
// sign in 
router.post("/sign-in", signin)
// google auth
router.post("/google", googleAuth)

export default router