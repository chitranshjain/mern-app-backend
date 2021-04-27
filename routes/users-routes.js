const express = require("express");

//Local imports
const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;
