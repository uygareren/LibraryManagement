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

const BorrowValidation = {
    params: Joi.object({
        userId: Joi.number().required(),
        bookId: Joi.number().required(),
    }),
};

const ReturnValidation = {
    params: Joi.object({
        userId: Joi.number().required(),
        bookId: Joi.number().required(),
    }),
    body: Joi.object({
        score: Joi.number().required()
    })
};

const router = express.Router();

const UserController = require("../controller/UserController");

// User routes
router.get("/", UserController.GetUsers);
router.get("/:userId", validate(GetUserValidation), UserController.GetUserById);
router.post("/", validate(PostUserValidation), UserController.PostUser)

// Borrow book route
router.post("/:userId/borrow/:bookId", validate(BorrowValidation), UserController.BorrowBook);

// Return book route
router.post("/:userId/return/:bookId", validate(ReturnValidation), UserController.ReturnBook);

module.exports = router;