import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedUsers: {
        type: [String]
    },
    password: {
        type: String
    },
    fromGoogle: {
        type: Boolean,
        default: false
    },
    roles: {
        type: [String],
        default: []
    }
}, {timestamps: true} )

export default mongoose.model('User', UserSchema)