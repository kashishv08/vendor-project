const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewform = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //jo listing k sath reviews hai unhe populate krne k liye.
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    res.redirect("/listings");
  }
  console.log(listing);
  console.log(listing.owner);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // let result = listingSchema.validate(req.body); //joi
  // console.log(result);
  // if(result.error){
  //     throw new ExpressError(400, result.error);
  // }
  // try{
  let url = req.file.path; // req.file = jaha hamara url hai image jo cloudinary ne save krvaya hai
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //that owner have same id of current user.
  newListing.image = { url, filename };
  newListing.category = req.body.listing.category;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  console.log(newListing);
  res.redirect("/listings");
  // } catch(err) {
  //     next(err);
  // }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  console.log(listing);
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  const updatedList = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path; // req.file = jaha hamara url hai image jo cloudinary ne save krvaya hai
    let filename = req.file.filename;
    updatedList.image = { url, filename };
    await updatedList.save();
  }

  console.log(updatedList);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  //console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

// Search/filter by country name
module.exports.filterByCountry = async (req, res) => {
  const rawCountry = req.params.country.replace(/-/g, " ");
  const allListing = await Listing.find({
    country: new RegExp(`^${rawCountry}$`, "i"), // case-insensitive exact match
  });

  if (!allListing.length) {
    req.flash("error", `No listings found for "${rawCountry}"`);
    return res.redirect("/listings");
  }
  req.flash(
    "success",
    `Found ${allListing.length} listing(s) in "${rawCountry}"`
  );
  res.render("./listings/index.ejs", { allListing });
};

module.exports.filterByCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  const allListing = await Listing.find({ category });

  if (!allListing.length) {
    req.flash("error", `No listings found for category "${category}"`);
    return res.redirect("/listings");
  }

  res.render("./listings/index.ejs", { allListing });
};
