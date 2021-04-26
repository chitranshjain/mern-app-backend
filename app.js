// Importing packages
const express = require("express");
const bodyParser = require("body-parser");

// Local imports
const HttpError = require("./models/http-error");

// Importing routes
const placesRoutes = require("./routes/places-routes");

// Initializing express app
const app = express();

//Using middlewares
app.use(bodyParser.json());

//Initializing the routes
app.use("/api/places", placesRoutes);

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
app.listen(5000);
