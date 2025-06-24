const Review=require("../models/review.js");
const Listing = require('../models/listing.js');

module.exports.review=(async(req,res)=>{
    let{id}=req.params;
    let listing= await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);

    await listing.save();
    await newReview.save();
        req.flash("success","thank you for review");
    res.redirect(`/listings/${listing._id}`)
});

module.exports.delete=(async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
});