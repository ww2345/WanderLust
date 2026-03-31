const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const rootRouter = require("./routes/root");
const userRouter = require("./routes/user");

const app = express();
const port = 3000;

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

const sessionOption = {
  secret: "ishant",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 6 * 24 * 60 * 60 * 1000,
    maxAge: 6 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.currPath = req.path;
  next();
});

app.use("/", rootRouter);
app.use("/", userRouter);
app.use("/listing", listingsRouter);
app.use("/listing/:id/review", reviewsRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`listning on port ${port}`);
});
