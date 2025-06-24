const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin ,validateReview} = require("../middleware.js");
const ReviewController=require("../controllers/reviewcontroller.js")
//Review Route
router.post("/",isLoggedin,validateReview,wrapAsync(ReviewController.review));

// delete Route
router.post("/:reviewid",isLoggedin,wrapAsync(ReviewController.delete));

module.exports=router;