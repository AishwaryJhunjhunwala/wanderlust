const Listing=require("../models/listing.js");
const mapToken=(process.env.MAP_TOKEN);


module.exports.index=(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
});

module.exports.new=(async (req, res)=>{
     res.render('listings/new.ejs');
});

module.exports.create=(async (req, res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    const mapUrl = `https://api.maptiler.com/geocoding/${newListing.location}.json?key=${mapToken}`;
    const response = await fetch(mapUrl);
    const data = await response.json();
    newListing.geometry=data.features[0].geometry;
    await newListing.save(); 
    req.flash("success","new listing created");
    res.redirect('/listings');
});

module.exports.show=(async (req, res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listing){
          req.flash("error"," listing doesn't exist");
          res.redirect('/listings');
    }else{
           res.render('listings/show.ejs', {listing});
    }
 
});

module.exports.edit=(async (req, res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
      let originalImage= listing.image.url;
      let convImage= originalImage.replace("/upload","/upload/h_300,w_250");

     if(!listing){
          req.flash("error"," listing doesn't exist");
          res.redirect('/listings');
        }else{
             res.render('listings/edit.ejs', {listing,convImage});
        }
   
});

module.exports.update=(async (req, res)=>{
    let{id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
    await listing.save();
    }
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);
});

module.exports.delete=(async (req, res)=>{
    let{id} = req.params;
    let deletelisting= await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
        req.flash("success"," listing deleted");
    res.redirect('/listings');
});