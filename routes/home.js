const express = require('express');
const router = express.Router({ mergeParams: true });

const home = require('../controllers/home');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');



//* HOME routes

router.get('/', home.index);

module.exports = router;