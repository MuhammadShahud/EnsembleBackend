/* eslint-disable prettier/prettier */
const express = require("express");
const { authController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");

const router = express.Router();

router.post("/login", validate(authValidation.login), authController.login);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;

