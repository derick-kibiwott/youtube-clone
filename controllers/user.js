import { createError } from "../error.js"
import User from "../Models/User.js"
import Video from "../Models/Video.js"

export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true })

            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can only update your account!"))
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Successfully deleted user!')
        } catch (err) {
            next(err)
        }

    } else {
        next(createError(403, "You cannot delete someone else's account!"))
    }

}
export const deleteUsers = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.roles.includes('admin')) {
        try {
            await User.remove({ "_id": { $nin: [req.user.id] } })
            res.status(200).json('Successfully deleted users!')
        } catch (err) {
            next(err)
        }

    } else {
        next(createError(403, "You don't have privileges to delete users!"))
    }

}
export const showUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (err) {
        next(err)
    }
}
export const showUsers = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.roles.includes('admin')) {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    } else {
        next(createError(403, "You don't have privileges to view all users!"))
    }
}
export const subscribe = async (req, res, next) => {
    try {
        // lets first check if the user exists
        const user = await User.findById(req.params.id)
        if (!user) {
            const err = new Error('User not found.');
            err.code = 404
            throw err
        }

        try {

            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { subscribedUsers: req.params.id }
            })

            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: 1 }
            })

            res.status(200).json('Subscription successful.')

        } catch (err) {
            next(err)
        }

    } catch (err) {
        next(err)
    }


}
export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subcribers: -1 }
        })

        res.status(200).json('Unsubscription successful.')

    } catch {
        next(err)
    }
}
export const like = async (req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })

        res.status(200).json("The video has been liked.")
    } catch (err) {
        next(err)
    }
}

export const dislike = async (req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })

        res.status(200).json("The video has been disliked.")
    } catch (err) {
        next(err)
    }
}

