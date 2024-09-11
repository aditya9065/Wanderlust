const Listing = require('../models/listing.js');


module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings})
}
module.exports.renderNewForm = (req, res)=>{
    res.render("./listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not Exist");
        res.redirect('/listings')   
    }
    res.render("./listings/show.ejs",{listing});
}
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let fileName = req.file.filename;
    console.log(url,",",fileName);
    req.flash("success", "New Listing Created..");
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, fileName};
    newListing.save();
    res.redirect("/listings");
}
module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let editListing = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, {...editListing});

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = {url, fileName};
        await listing.save();
    }
    req.flash("success", "Listing Updated..");
    res.redirect("/listings/"+id);
}
module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted..");
    res.redirect("/listings")
}