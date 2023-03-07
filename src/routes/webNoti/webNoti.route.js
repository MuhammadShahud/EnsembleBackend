const express = require("express");
const router = express.Router();
const { webNotiController } = require("../../controllers");


router.route("/")
.post(webNotiController.createNoti)
.get(webNotiController.getNoti)

module.exports = router;
