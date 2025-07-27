const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("DB connected");
	} catch (error) {
		console.error(" MongoDB connection failed:", error.message);
		throw error;
	}
};

module.exports = connectDB;
