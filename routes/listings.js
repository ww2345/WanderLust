const express = require("express");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const router = express.Router();
const { isOwner } = require("../middleware");
const listingcontroller = require("../controllers/listing.js");


router.get("/", wrapAsync(listingcontroller.index));

router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

//show route 
router.get("/:id", wrapAsync(listingcontroller.showListing));
// new listing
router.post(
  "/",
  wrapAsync(listingcontroller.createListing),
);

router.get("/:id/edit", isLoggedIn, wrapAsync(listingcontroller.editRenderForm));
// update route 
router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingcontroller.updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingcontroller.destoryListing));

module.exports = router;
