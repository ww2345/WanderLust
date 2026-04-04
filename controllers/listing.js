const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const reqData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!reqData) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }
  res.render("listing/show.ejs", { reqData });
};

module.exports.createListing = async (req, res) => {
  const { title, description, price, country, location, image } = req.body;

  const listingData = {
    title,
    description,
    price,
    country,
    location,
    owner: req.user._id,
  };

  if (image && (image.url || image.filename)) {
    listingData.image = image;
  }



  const newListing = await Listing.create(listingData);
  req.flash("success", "Listing created successfully");
  res.redirect(`/listing/${newListing._id}`);
};

module.exports.editRenderForm = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }
  res.render("listing/edit.ejs", { data });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, country, location, image } = req.body;

  const updateData = { title, description, price, country, location };
  if (image && (image.url || image.filename)) {
    updateData.image = image;
  }

  await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listing/${id}`);
};

module.exports.destoryListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listing");
}; 