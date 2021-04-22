//Local imports
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous skyscrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === pid;
  });
  console.log("GET request in places route");

  if (!place) {
    throw new HttpError(
      "Could not find a place for the provided place id.",
      404
    );
  }
  res.json({ message: "It works", place });
};

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  let places = [];
  DUMMY_PLACES.forEach((p) => {
    if (p.creator === uid) {
      places.push(p);
    }
  });

  if (places.length === 0) {
    return next(
      new Error("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ places });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
