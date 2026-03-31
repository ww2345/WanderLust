const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password);

    req.flash("success", "Welcome to WanderLust! ");
    res.redirect("/listing");
  }
  catch (e) {
    req.flash("error", "Username Already Exists ");
    res.redirect("/signup");
  }
}));


router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  req.flash("success", "welcome to Wanderlust you are logged in !! ");
  res.redirect("/listing");

});

router.get("/logout", (req , res , next )=>{
  req.logout((err)=>{
    if(err){
      return err ;
    }
    req.flash("success", "Logout successfull");
    res.redirect("/listing");
  });
})

module.exports = router;

