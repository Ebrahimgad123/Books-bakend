const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();
const dbConfig = require("./config/db");
const { logger } = require("./middlewares/logger");
const { notFound, errorHandling } = require("./middlewares/errorHandler");

const app = express(); // Initialize the Express app
const port = process.env.PORT || 8000;

// Set the view engine to EJS
app.set("view engine", "ejs");
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use("/images", express.static(path.join(__dirname, "images")));
// Logger middleware
app.use(logger);

// API Routes
app.use('/',(req,res)=>{
  res.send("hello To my project Book store backend")
})
app.use("/api", require("./route/booksRoute"));
app.use("/api", require("./route/authorsRoute"));
app.use("/api", require("./route/authRoute"));
app.use("/api", require("./route/usersRoute"));
app.use("/api", require("./route/upload"));
app.use("/password", require("./route/password"));

// Error Handling middleware
app.use(notFound);
app.use(errorHandling);

// Start the server
app.listen(port, () =>
  console.log(
    `Server is listening on port ${port} in ${process.env.NODE_ENV} mode`,
  ),
);

