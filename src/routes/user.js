const express = require("express");
const User = require("../models/user");
const userRouter = express.Router()
const { userRegistrationValidation, loginValidation } = require("../utilis/validation")
const userAuth = require("../middlewares/userAuth")
const bcrypt = require('bcrypt');
const upload = require("../middlewares/multerMiddleware");
const path = require("path")
const fs = require("fs")
// user registration

// POST /register
userRouter.post(
    "/register",
    upload.single("photo"),
    userRegistrationValidation,
    async (req, res) => {
        try {
            const { firstName, lastName, password, email } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userData = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                photo: req.file ? req.file.filename : null,
            });
            const data = await userData.save();
            res.status(201).json({ message: "Successfully Registered", data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something Went Wrong" });
        }
    }
);

//  user login api
userRouter.post("/login", loginValidation, (req, res) => {
    try {

        res.status(201).json({
            message: "Login Successfull",
        })

    } catch (error) {
        res.status(400).send("Somethig went Wrong")
    }
})

// user logout

userRouter.post("/logout", userAuth, (req, res) => {
    try {

        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.status(201).send("Successfully Logout")

    } catch (error) {
        res.status(400).send("Something Went Wrong")
    }
})

// authUser

userRouter.get("/profile", userAuth, (req, res) => {
    try {

        const user = req.user;
        res.status(201).json({
            message: "Get Auth User",
            data: user
        })

    } catch (error) {
        res.status(400).send("Something Went Wrong")
    }
})

userRouter.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the photo if exists
        if (user.photo) {
            const photoPath = path.join(__dirname, "../uploads", user.photo);
            // Check if file exists before deleting
            if (fs.existsSync(photoPath)) {
                fs.unlink(photoPath, (err) => { if (err) console.error(err) });
            }
        }

        // Delete user from DB
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// get all user

userRouter.get("/users", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({})
        const totalPage = Math.ceil(totalUsers / limit)

        const users = await User.find({}).skip(skip).limit(limit)

        res.status(201).json({
            message: "Fetch All User",
            data: users,
            meta: {
                page,
                limit,
                totalPage,
                totalUsers
            }

        })

    } catch (error) {
        console.log(error)
        res.status(400).send("Something went Wrong")
    }

})

module.exports = userRouter