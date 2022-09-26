const {Router} = require('express');
const {userController} = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = Router();

router.route('/').post(
  // auth("superadmin"),
  validate(userValidation.createUser),
  userController.createUser,
);
// .get(userController.getAllUser);


router.route('/:id')
  .get(userController.getUserById)
// .delete(userController.deleteUser)
.patch(userController.updateUserById);

module.exports = router;
