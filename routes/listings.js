const express = require("express");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const router = express.Router();
const { isOwner } = require("../middleware");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/").get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingcontroller.createListing),
  );



router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingcontroller.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destoryListing));




// new listing


router.get("/:id/edit", isLoggedIn, wrapAsync(listingcontroller.editRenderForm));



module.exports = router;
