require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// ENV
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8000";

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", todoRouter);

// Connect DB & start server
connectDB()
	.then(() => {
		console.log("Database Connection Established!");
		app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
	})
	.catch((err) => console.error("DB Connection Failed:", err.message));
