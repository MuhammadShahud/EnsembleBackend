/* eslint-disable prettier/prettier */
const express = require('express');
const userRoute = require('./user/user.route');
const authRoute = require('./auth/auth.route');
const goalsRoute = require('./goals/goals.route');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/goals', goalsRoute);


module.exports = router;
