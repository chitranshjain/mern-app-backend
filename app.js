// Importing packages
const express = require("express");
const bodyParser = require("body-parser");

// Imprting routes
const placesRoutes = require("./routes/places-routes");

// Initializing express app
const app = express();

//Initializing the routes
app.use("/api/places", placesRoutes);

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
