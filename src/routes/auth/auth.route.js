/* eslint-disable prettier/prettier */
const express = require("express");
const { authController, userController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgetPass', authController.forgetPassword);

router.post('/signinCompany', authController.signinCompany);
router.post('/signupCompany', authController.signupCompany);
router.post('/forgetPassCompany', authController.forgetPasswordCompany);
router.post('/changePassCompany', authController.changePasswordCompany);




router.route('/:id')
.patch(userController.updateUserById);

router.route('/changePass').post(authController.changePassword)

module.exports = router;

