const express = require("express");
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { validationReview, isLoggedIn, isAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");
const router = express.Router({ mergeParams: true });



// for deleting reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReviews)
);

// post for review
router.post(
  "/", isLoggedIn,
  validationReview,
  wrapAsync(reviewController.createReview),
);

module.exports = router;
