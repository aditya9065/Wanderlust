const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLogggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require('../controllers/listings.js');
const multer = require('multer')
const {storage} = require('../cloudConfig.js');

const upload = multer({storage})



//Index/Show all Listing
router.get("/", wrapAsync(index));

//add page for listings
router.get("/new",isLogggedIn, renderNewForm);

//show specific listing
router.get("/:id", wrapAsync(showListing));

//add new listing
router.post("/",isLogggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createListing));

//to update page
router.get("/:id/edit", isLogggedIn, isOwner,  wrapAsync(renderEditForm));

//update listing
router.put("/:id",upload.single("listing[image]"), validateListing,isLogggedIn, isOwner, wrapAsync(updateListing));

//destroy listing
router.delete("/:id", isLogggedIn, isOwner, wrapAsync(destroyListing));

module.exports = router;