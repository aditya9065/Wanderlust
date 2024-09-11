const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Comment Added..");
    res.redirect(  `/listings/${listing._id}`);
}
module.exports.destroyReview =async (req, res) => {
    let {id, reviewId} = req.params;
    let listing = await Listing.findById(req.params.id);

    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Comment Deleted..");
    res.redirect(`/listings/${listing._id}`)
}
 