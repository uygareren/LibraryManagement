const express = require("express");
const router = express.Router();

const UserController = require("../controller/UserController");

router.get("/users", UserController.GetUser);

module.exports = router;