const express = require("express");
const { Joi, validate } = require('express-validation');

const GetBookValidation = {
    params: Joi.object({
        bookId: Joi.number().required(),
    }),
};

const PostBookValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    }),
};

const router = express.Router();

const BookController = require("../controller/BookController");

router.get("/", BookController.GetBooks);
router.get("/:bookId", validate(GetBookValidation), BookController.GetBookById);
router.post("/", validate(PostBookValidation), BookController.PostBook);

module.exports = router;