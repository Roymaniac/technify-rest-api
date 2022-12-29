const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middlewares/errorMiddleware");
const connectDB = require("../src/config/db");
const port = process.env.PORT;
const cors = require("cors");
const { logger } = require("./helpers/logger");

connectDB(); // DB config

const app = express();

const userRoutes = require("./modules/userModules/user.routes"); // UserRoutes import

// cors middleware
app.use(cors());


// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Web Route
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("⚡️[server]: Express Server");
});


// custom error handle middleware
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at https://localhost:${port}`);
});
