const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const { getCoordsForAddress } = require("../utils/location");

//Local imports
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/users");

const getPlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (error) {
    const err = new HttpError("Something went wrong.", 500);
    return next(err);
  }
  console.log("GET request in places route");

  if (!place) {
    const err = new HttpError(
      "Could not find a place for the provided place id.",
      404
    );
    return next(err);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const uid = req.params.uid;

  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(uid).populate("places");
  } catch (error) {
    const err = new HttpError("Something went wrong.", 500);
    return next(err);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new Error("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    creator,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    location: getCoordsForAddress(),
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user with the provided creator ID.",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    const err = new HttpError(
      "Failed to create place, please try again after some time.",
      500
    );

    return next(err);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong.", 500);
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Could not update place.", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided place ID.",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("There was an error removing the place.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Place successfully deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
