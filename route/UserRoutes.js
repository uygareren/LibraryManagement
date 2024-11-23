const express = require("express");
const { Joi, validate } = require('express-validation');

const GetUserValidation = {
    params: Joi.object({
        userId: Joi.number().required(),
    }),
};

const PostUserValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    }),
};


const router = express.Router();

const UserController = require("../controller/UserController");

router.get("/", UserController.GetUser);
router.get("/:userId", validate(GetUserValidation), UserController.GetUserById);
router.post("/", validate(PostUserValidation), UserController.PostUser)
module.exports = router;