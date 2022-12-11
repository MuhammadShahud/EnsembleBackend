const express = require("express");
const router = express.Router();
const { notiController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/token")
.post(notiController.createToken)
.get(notiController.getTokens);

router.route('/token/:id')
.patch(notiController.updateToken);

router.route("/")
.post(notiController.createNoti)
.get(notiController.getNoti)

module.exports = router;
