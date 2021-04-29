const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/users");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!users) {
    const error = new HttpError("Could not find any users.", 404);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (existingUser) {
    throw new HttpError("Email already registered", 422);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?size=626&ext=jpg",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "User signed up successfully",
    user: createdUser.toObject({ getters: true }),
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const err = new HttpError("Invalid credentials.", 401);
    return next(err);
  }

  res.json({ message: "User logged in successfully." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
