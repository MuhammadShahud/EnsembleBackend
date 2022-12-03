const express = require("express");
const router = express.Router();
const { surveyController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(surveyController.createSurvey)
.get(surveyController.getSurveys);

router.route('/:id')
.patch(surveyController.updateSurvey);


module.exports = router;
