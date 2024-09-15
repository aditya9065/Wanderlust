const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLogggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing, home } = require('../controllers/listings.js');
const multer = require('multer')
const {storage} = require('../cloudConfig.js');

const upload = multer({storage})


router.get("/", wrapAsync(home));

module.exports = router; 