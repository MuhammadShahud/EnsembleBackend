const express = require("express");
const router = express.Router();
const { goalsController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(authValidation.validateToken,goalsController.createGoal)
.get(authValidation.validateToken,goalsController.getGoals);

router.route('/:id')
.patch(authValidation.validateToken,goalsController.updateGoal)
.delete(authValidation.validateToken,goalsController.deleteGoal)


module.exports = router;
