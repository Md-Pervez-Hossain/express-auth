const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required"],
        trim: true,

    },
    lastName: {
        type: String,
        trim: String,
        required: [true, "Last Name is Required"],

    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is Required"],

    },
    photo: { type: String },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is Required"]
    },
    description: {
        type: String,
        trim: true,
        default: "This is My Defaulr Bio"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)