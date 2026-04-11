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
  const imageUrl = typeof image === "string" ? image.trim() : "";

  const listingData = {
    title,
    description,
    price,
    country,
    location,
    owner: req.user._id,
  };

  if (req.file) {
    listingData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else if (imageUrl) {
    listingData.image = {
      url: imageUrl,
      filename: "external-link",
    };
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
  const imageUrl = typeof image === "string" ? image.trim() : "";

  const updateData = { title, description, price, country, location };
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else if (imageUrl) {
    updateData.image = {
      url: imageUrl,
      filename: "external-link",
    };
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
