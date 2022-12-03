/* eslint-disable prettier/prettier */
const express = require('express');
const userRoute = require('./user/user.route');
const authRoute = require('./auth/auth.route');
const goalsRoute = require('./goals/goals.route');
const companyRoute = require('./company/company.route');
const teamRoute = require('./team/team.route');
const surveyRoute = require('./survey/survey.route');



const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/goals', goalsRoute);
router.use('/company', companyRoute);
router.use('/team', teamRoute);
router.use('/survey', surveyRoute);



module.exports = router;
