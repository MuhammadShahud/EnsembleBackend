const express = require("express");
const router = express.Router();
const { fixedSurveyController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(fixedSurveyController.createSurvey)
.get(fixedSurveyController.getSurveys);

router.route('/:id')
.patch(fixedSurveyController.updateSurvey);


module.exports = router;
