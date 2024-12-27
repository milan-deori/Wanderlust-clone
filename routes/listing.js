const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {cloudinary,storage}=require("../cloudConfig.js");
const upload = multer({ storage });





//Index route..
  router.get("/",wrapAsync(listingController.index)); 

//New Route..
  router.get("/new",isLoggedIn,listingController.new);

//Show Route..
  router.get("/:id",wrapAsync(listingController.show));

//Create Route...
   router.post("/",isLoggedIn,  upload.single("listing[image]"), validateListing,
   wrapAsync(listingController.create));

  
//Edit Route...
  router.get("/:id/edit", isLoggedIn,isOwner,
    wrapAsync(listingController.edit));
  
//Update Route.
  router.put("/:id",isLoggedIn,isOwner,  upload.single("listing[image]"), validateListing,
    wrapAsync(listingController.update));
  
//Delete route..
  router.delete("/:id", isLoggedIn,isOwner,
    wrapAsync(listingController.delete));


  module.exports=router;