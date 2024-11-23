const express = require("express");
const { Joi, validate } = require('express-validation');

const GetUserValidation = {
    params: Joi.object({
        userId: Joi.number().required(),
    }),
};



const router = express.Router();

const BookController = require("../controller/BookController");

router.get("/", BookController.GetBooks);

module.exports = router;