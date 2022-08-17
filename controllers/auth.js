import mongoose from "mongoose"
import User from "../Models/User.js"
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {

        const user = await User.findOne({ email: req.body.email })
        if (user) throw new Error()

        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            // Store hash in your password DB.
            const newUser = new User({
                ...req.body, password: hash, roles: await User.count() === 0 ? ['admin'] : []
            })

            await newUser.save()
            res.status(200).json('User has been created!')

        } catch (err) {
            // throw
            next(err)
        }
    } catch {
        next(createError(409, "You have already signed up, please login"))
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return next(createError(401, 'User not found.'))

        const isCorrect = await bcrypt.compare(req.body.password, user.password)

        if (!isCorrect) return next(createError(401, 'Wrong Credentials.'))

        const token = jwt.sign({ id: user._id }, process.env.JWT)

        const { password, ...others } = user._doc

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(others)

    } catch (err) {
        // throw
        next(err)
    }

}

export const googleAuth = async (req, res, next) => {
    try {
        const exists = await User.findOne({ email: req.body.email })
        if (exists) {

            // update avatar
            const {img} = req.body
            const user = await User.findByIdAndUpdate(exists._id, {
                $set: { img: img }
            }, { new: true }
            )

            const token = jwt.sign({ id: user._id }, process.env.JWT)

            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200)

            if (user._doc?.password) {
                const { password, ...others } = user._doc
                res.json(others)
            } else {
                const others = user._doc
                res.json(others)
            }

        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
                roles: await User.count() === 0 ? ['admin'] : []
            })

            const user = await newUser.save()
            const token = jwt.sign({ id: user._id }, process.env.JWT)

            const others = user._doc

            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(others)
            res.status(200).json('User has been created!')
        }
    } catch (err) {
        next(err)
    }
}