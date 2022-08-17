import express from "express";
import { dislike, showUser, showUsers, subscribe, unsubscribe, deleteUser, deleteUsers, like, update } from "../controllers/user.js";
import verifyToken from "../verifyToken.js";
import verifyAdminToken from "../verifyAdminToken.js";

const router = express.Router()

router.put('/:id', verifyToken, update)
router.delete('/all', verifyAdminToken, deleteUsers)
router.delete('/:id', verifyToken, deleteUser)
router.put('/subscribe/:id', verifyToken, subscribe)
router.put('/unsubscribe/:id', verifyToken, unsubscribe)
router.put('/like/:videoId', verifyToken, like)
router.put('/dislike/:videoId', verifyToken, dislike)
router.get('/all', verifyToken, showUsers)
router.get('/:id', showUser)

export default router