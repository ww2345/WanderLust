
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
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
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome to Wanderlust you are logged in !! ");
  const redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);

};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successfull");
    res.redirect("/listing");
  });
}; 