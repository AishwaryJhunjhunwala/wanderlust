const express=require("express");
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedin,validateListing}=require("../middleware.js");
const ListingController=require("../controllers/listingcontroller.js");
const methodOverride = require('method-override');
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get( wrapAsync(ListingController.index))  //index route
.post(isLoggedin,validateListing,upload.single("listing[image]"), wrapAsync(ListingController.create)); //create route

//new route
router.get('/new',isLoggedin, wrapAsync(ListingController.new));

router.route("/:id")
.get( wrapAsync(ListingController.show)) //show route
.put(isLoggedin,validateListing,upload.single("listing[image]"), wrapAsync(ListingController.update))  //update route
.delete( isLoggedin,wrapAsync(ListingController.delete)); //delete route

//edit route
router.get('/:id/edit', isLoggedin,wrapAsync(ListingController.edit));

module.exports= router;