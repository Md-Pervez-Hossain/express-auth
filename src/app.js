const express = require("express");
const app = express();
const connectDB = require("./config/database");
const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const http = require("http");

const cors = require("cors");
const initializeSocket = require("./utilis/socket");

app.use(
	cors({
		origin: "http://localhost:8000",
		credentials: true,
	})
);

// socket
let server = http.createServer(http);
initializeSocket(server);

//express middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", todoRouter);

//Database connection and Server Runing port
connectDB()
	.then(() => {
		console.log("Database Connection Established !");
		server.listen(8000, () => {
			console.log("Server is Running on Port 8000 !");
		});
	})
	.catch(() => {
		console.log("Something Went Wrong");
	});
