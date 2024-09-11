const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLogggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const { createReview, destroyReview } = require('../controllers/reviews.js');



//Reviews Post Route 
router.post("/", isLogggedIn, validateReview, wrapAsync(createReview));

//review delete 
router.delete("/:reviewId", isReviewAuthor,isLogggedIn, destroyReview);

module.exports = router;