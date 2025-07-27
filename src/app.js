require("dotenv").config(); 
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./utilis/socket");

// ENV variables
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8000";

// Middleware
app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", todoRouter);

// Create server with socket support
const server = http.createServer(app);
initializeSocket(server);

// Connect to DB and start server
connectDB()
	.then(() => {
		console.log("Database Connection Established!");
		server.listen(PORT, () => {
			console.log(`Server is Running on Port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Database Connection Failed:", err.message);
	});
