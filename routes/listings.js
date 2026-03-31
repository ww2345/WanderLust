const express = require("express");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware");
const router = express.Router();

router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
});

router.get("/new",isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const reqData = await Listing.findById(id).populate("reviews");
  if (!reqData) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }
  res.render("listing/show.ejs", { reqData });
});

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { title, description, price, country, location, image } = req.body;

    const listingData = {
      title,
      description,
      price,
      country,
      location,
    };

    if (image && (image.url || image.filename)) {
      listingData.image = image;
    }

    const newListing = await Listing.create(listingData);
    req.flash("success", "Listing created successfully");
    res.redirect(`/listing/${newListing._id}`);
  }),
);

router.get("/:id/edit",isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }
  res.render("listing/edit.ejs", { data });
});

router.put("/:id",isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, country, location, image } = req.body;

  const updateData = { title, description, price, country, location };
  if (image && (image.url || image.filename)) {
    updateData.image = image;
  }

  await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listing/${id}`);
});

router.delete("/:id",isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listing");
});

module.exports = router;
