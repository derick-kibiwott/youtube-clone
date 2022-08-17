import express from "express";
import { addVideo, updateVideo, showVideo, deleteVideo, deleteVideos, incrementViews, trending, random, subscribed, getByTag, search } from "../controllers/video.js";
import verifyToken from "../verifyToken.js";
import verifyAdminToken from "../verifyAdminToken.js";

const router = express.Router()

// create a video
router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/all', verifyAdminToken, deleteVideos)
router.delete('/:id', verifyToken, deleteVideo)
router.put('/increment-views/:id', incrementViews)
router.get('/trending', trending)
router.get('/random', random)
router.get('/tags', getByTag)
router.get('/search', search)
router.get('/subscribed', verifyToken, subscribed)
router.get('/:id', showVideo)

export default router