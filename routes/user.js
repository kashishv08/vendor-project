const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

router.get("/vendor/dashboard", isLoggedIn, async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  res.render("dashboard/vendor", { listings });
});

router.get("/admin/dashboard", isLoggedIn, async (req, res) => {
  if (req.user.role !== "admin") {
    req.flash("error", "Access denied.");
    return res.redirect("/");
  }
  const listings = await Listing.find({});
  const users = await User.find({});
  res.render("dashboard/admin", { listings, users });
});

module.exports = router;
