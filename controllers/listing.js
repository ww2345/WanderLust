const Listing = require("../models/listing");
const {
  LISTING_CATEGORIES,
  FORM_CATEGORIES,
  normalizeCategory,
  getCategoryMeta,
  resolveListingCategory,
  buildCategoryQuery,
} = require("../utils/listingCategories");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  const activeCategory = normalizeCategory(req.query.category);
  const searchQuery = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const searchConditions = [];
  const categoryQuery = buildCategoryQuery(activeCategory);

  if (Object.keys(categoryQuery).length) {
    searchConditions.push(categoryQuery);
  }

  if (searchQuery) {
    const keywordRegex = new RegExp(escapeRegex(searchQuery), "i");
    searchConditions.push({
      $or: [
        { title: keywordRegex },
        { description: keywordRegex },
        { location: keywordRegex },
        { country: keywordRegex },
        { category: keywordRegex },
      ],
    });
  }

  const mongoQuery =
    searchConditions.length === 0
      ? {}
      : searchConditions.length === 1
        ? searchConditions[0]
        : { $and: searchConditions };

  const allListing = await Listing.find(mongoQuery).lean();
  const listingCards = allListing.map((listing) => {
    const categorySlug = resolveListingCategory(listing);
    return {
      ...listing,
      categoryMeta: categorySlug ? getCategoryMeta(categorySlug) : null,
    };
  });

  res.render("listing/index.ejs", {
    allListing: listingCards,
    filters: LISTING_CATEGORIES,
    activeCategory,
    activeFilter: getCategoryMeta(activeCategory),
    searchQuery,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs", { categories: FORM_CATEGORIES });
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
  const { title, description, price, country, location, image, category } = req.body;
  const imageUrl = typeof image === "string" ? image.trim() : "";
  const normalizedCategory = normalizeCategory(category);

  const listingData = {
    title,
    description,
    price,
    country,
    location,
    category:
      normalizedCategory !== "all"
        ? normalizedCategory
        : resolveListingCategory({ title, description, location, country }),
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
  res.render("listing/edit.ejs", {
    data,
    categories: FORM_CATEGORIES,
    selectedCategory: data.category || resolveListingCategory(data),
  });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, country, location, image, category } = req.body;
  const imageUrl = typeof image === "string" ? image.trim() : "";
  const normalizedCategory = normalizeCategory(category);

  const updateData = {
    title,
    description,
    price,
    country,
    location,
    category:
      normalizedCategory !== "all"
        ? normalizedCategory
        : resolveListingCategory({ title, description, location, country }),
  };
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
