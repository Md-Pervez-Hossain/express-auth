const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("DB connected");
	} catch (error) {
		console.error(" MongoDB connection failed:", error.message);
		throw error;
	}
};

module.exports = connectDB;
