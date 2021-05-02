const { check } = require("express-validator");
const express = require("express");

//Local imports
const usersControllers = require("../controllers/users-controller");
const fileUpload = require("../middlewares/file-upload");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login",
[
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
], usersControllers.login);

module.exports = router;
