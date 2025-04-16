const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let listings = await Listing.findById(req.params.id); // id is of listing hence used mergeParams.
  let newReview = new Review(req.body.review); //req.body will give the client data to server.
  newReview.author = req.user._id;
  listings.reviews.push(newReview);

  await newReview.save();
  await listings.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listings._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
