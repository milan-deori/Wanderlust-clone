const Listing=require("../models/listing");




module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
  }

  module.exports.new=(req,res)=>{
    res.render("listings/new.ejs");

}


module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{
      path:"author"
    }})
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing not exist!");
      res.redirect("/listings");
    }
   // console.log(listing);
    res.render("./listings/show.ejs",{listing});
}


module.exports.create=async(req,res,next)=>{
    // let {title,description,price,location,country,image}=req.body;
   let url= req.file.path;
   let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }


  module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing not exist!");
      res.redirect("/listings");
    }

    let originalImage=listing.image.url;
   originalImage= originalImage.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{listing,originalImage});
}


module.exports.update=async(req,res)=>{
    let {id}=req.params;
  let listing= await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
  if(typeof req.file !=="undefined"){
    let url= req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
 
   req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`)
}


module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
}