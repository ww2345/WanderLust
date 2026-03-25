const express = require("express");
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { reviewSchema } = require("../Schema");

const router = express.Router({ mergeParams: true });

// validation (server side for db )
const validationReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// for deleting reviews
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listing/${id}`);
  }),
);

// post for review
router.post(
  "/",
  validationReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    const reviewData = req.body && req.body.review ? req.body.review : req.body;
    if (!reviewData || typeof reviewData !== "object") {
      throw new ExpressError(400, "Missing review data");
    }

    const rating =
      reviewData.rating !== undefined && reviewData.rating !== null
        ? Number(reviewData.rating)
        : null;
    const comment =
      typeof reviewData.comment === "string" ? reviewData.comment.trim() : "";

    const hasRating = Number.isFinite(rating);
    const hasComment = comment.length > 0;

    if (!hasRating && !hasComment) {
      throw new ExpressError(400, "Review cannot be empty");
    }
    if (hasRating && (rating < 1 || rating > 5)) {
      throw new ExpressError(400, "Rating must be between 1 and 5");
    }

    const newReview = new Review({
      rating: hasRating ? rating : undefined,
      comment: hasComment ? comment : undefined,
    });
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();

    req.flash("success", "Review added successfully");
    res.redirect(`/listing/${id}`);
  }),
);

module.exports = router;
