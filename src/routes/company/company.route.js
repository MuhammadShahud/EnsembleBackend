const express = require("express");
const router = express.Router();
const { companyController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const { companyService } = require("../../services");
const authValidation = require("../../validations/auth.validation");


router.route('/profilePic/:id').patch(upload.single('file'),companyController.postPic)

router.route('/:id')
.patch(companyController.updateCompanyById)
.get(companyController.getCompanyById)

router.route('/statistics/:id')
.get(companyController.getStatistics)

router.route('/changePass/:id').patch(companyService.changePassword)


module.exports = router;
