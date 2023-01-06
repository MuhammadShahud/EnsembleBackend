const {Router} = require('express');
const {userController} = require('../../controllers');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');
const validate = require('../../middlewares/validate');
const { userService } = require('../../services');
const userValidation = require('../../validations/user.validation');

const router = Router();

router.route('/').post(
  // auth("superadmin"),
  validate(userValidation.createUser),
  userController.createUser,
);
// .get(userController.getAllUser);
router.route('/profilePic/:id').patch(upload.single('file'),userController.postPic)
router.route('/changePass/:id').patch(userService.changePassword)
router.route('/:id')
  .get(userController.getUserById)
// .delete(userController.deleteUser)
.patch(userController.updateUserById);

module.exports = router;
