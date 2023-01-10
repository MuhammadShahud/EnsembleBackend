const express = require("express");
const router = express.Router();
const { companyController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const authValidation = require("../../validations/auth.validation");


router.route('/profilePic/:id').patch(upload.single('file'),companyController.postPic)

router.route('/:id')
.patch(companyController.updateCompanyById)
.get(companyController.getCompanyById)

module.exports = router;
