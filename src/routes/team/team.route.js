const express = require("express");
const router = express.Router();
const { teamController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(teamController.createTeam)

router.route('/:id')
.patch(teamController.updateTeamById)
.get(teamController.getTeamById)
.delete(teamController.deleteTeam)

module.exports = router;
