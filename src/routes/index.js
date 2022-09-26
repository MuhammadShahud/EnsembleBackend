/* eslint-disable prettier/prettier */
const express = require('express');
const userRoute = require('./user/user.route');
const authRoute = require('./auth/auth.route');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);


module.exports = router;
