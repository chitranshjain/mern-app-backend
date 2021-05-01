// Importing packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Local imports
const HttpError = require("./models/http-error");

// Importing routes
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

// Initializing express app
const app = express();
dotenv.config();

//Using middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//Initializing the routes
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// Default route not found error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//Error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

// Running server on port 5000

mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is up and running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Could not connect to the database. Error : " + err.message);
  });
