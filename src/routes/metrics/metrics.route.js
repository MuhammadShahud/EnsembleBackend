const express = require("express");
const router = express.Router();
const { metricsController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(metricsController.createMetrics)
.get(metricsController.getMetrics);

router.route('/:id')
.patch(metricsController.updateMetrics);


module.exports = router;
