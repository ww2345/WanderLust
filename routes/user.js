const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust! ");
      res.redirect("/listing");

    })

  }
  catch (e) {
    req.flash("error", "Username Already Exists ");
    res.redirect("/signup");
  }
}));


router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  req.flash("success", "welcome to Wanderlust you are logged in !! ");
  const redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);

});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successfull");
    res.redirect("/listing");
  });
})

module.exports = router;
