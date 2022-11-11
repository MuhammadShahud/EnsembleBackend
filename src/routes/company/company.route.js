const express = require("express");
const router = express.Router();
const { companyController } = require("../../controllers");
const authValidation = require("../../validations/auth.validation");


router.route("/")
.post(companyController.createCompany)

router.route('/:id')
.patch(companyController.updateCompanyById)
.get(companyController.getCompanyById)


module.exports = router;
