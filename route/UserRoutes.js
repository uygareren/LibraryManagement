const express = require("express");
const { Joi, validate } = require('express-validation');

const GetUserValidation = {
    params: Joi.object({
        userId: Joi.number().required(),
    }),
};


const router = express.Router();

const UserController = require("../controller/UserController");

router.get("/users", UserController.GetUser);
router.get("/users/:userId", validate(GetUserValidation), UserController.GetUserById);

module.exports = router;