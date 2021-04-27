const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Chitransh Jain",
    email: "test@test.com",
    password: "tester",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Email already registered", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res
    .status(201)
    .json({ message: "User signed up successfully", user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser) {
    throw new HttpError("No user found with the provided email address.", 401);
  }

  if (identifiedUser.password !== password) {
    throw new HttpError("Invalid password", 401);
  } else {
    res
      .status(400)
      .json({ message: "Signed in successfully.", user: identifiedUser });
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
