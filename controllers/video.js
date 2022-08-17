import { request } from "express"
import { createError } from "../error.js"
import User from "../Models/User.js"
import Video from "../Models/Video.js"

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body })
    try {
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    } catch (err) {
        next(err)
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, 'Video not found.'))

        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true }
            )

            res.status(200).json(updatedVideo)

        } else {
            next(createError(403, "You can only update your video."))
        }

    } catch (err) {
        next(err)
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, 'Video not found.'))

        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndDelete(req.params.id)

            res.status(200).json('Successfully deleted video.')

        } else {
            next(createError(403, "You can only delete your video."))
        }

    } catch (err) {
        next(err)
    }
}

export const deleteVideos = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id)
        if (user.roles.includes('admin')) {

            try {
                await Video.deleteMany({})
                res.status(200).json('Successfully deleted videos!')
            } catch (err) {
                next(err)
            }

        } else {
            next(createError(403, "You don't have privileges to delete videos!"))
        }


    } catch (err) {
        next(err)
    }
}

export const showVideo = async (req, res, next) => {

    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)

    } catch (err) {
        next(createError(404, 'Video not found'))
    }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { view: 1 }
        })
        res.status(200).json('The view has been increased.')

    } catch (err) {
        next(err)
    }
}

export const trending = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 })
        res.status(200).json(videos)

    } catch (err) {
        next(err)
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(videos)

    } catch (err) {
        next(err)
    }
}

export const getByTag = async (req, res, next) => {
    try {
        const tags = req.query.tags.split(",")
        const videos = await Video.find({ tags: { $in: tags } }).limit(20)

        res.status(200).json(videos)

    } catch (err) {
        next(err)
    }
}

export const search = async (req, res, next) => {
    try {
        const query = req.query.q
        const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40)

        res.status(200).json(videos)

    } catch (err) {
        next(createError(404, 'No results found.'))
    }
}

export const subscribed = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers

        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Video.find({ userId: channelId })
            })
        )

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createAt))

    } catch (err) {
        next(err)
    }
}

export const incrementViews = async (req, res, next) => {

    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })

        res.status(200).json("Video views added.")

    } catch (err) {
        next(createError(404, 'Video not found.'))
    }
}