const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected successfull to db ");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log(`listning on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("root is working");
});

app.get("/listing", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });

})
// creating new listing 
app.get("/listing/new", (req, res) => {

  res.render("listing/new.ejs");
})
// show specific info for place 
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let reqData = await Listing.findById(id);

  res.render("listing/show.ejs", { reqData });
});

app.post("/listing", wrapAsync(async (req, res) => {

  let { title, description, price, country, location, image } = req.body;

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

  res.redirect(`/listing/${newListing._id}`);



}));


app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  res.render("listing/edit.ejs", { data });
})

app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, price, country, location, image } = req.body;

  const updateData = { title, description, price, country, location };
  if (image && (image.url || image.filename)) {
    updateData.image = image;
  }

  await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
  res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

//post for review 
app.post("/listing/:id/review", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  const newReview = new Review(req.body.review);
  await newReview.save();

  listing.reviews.push(newReview._id);
  await listing.save();

  res.redirect(`/listing/${id}`);
}));

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
}); 
