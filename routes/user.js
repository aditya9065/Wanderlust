const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');
const { signup, renderSignupForm, renderLoginForm, login, logout } = require('../controllers/users.js');

router.get("/signup", renderSignupForm);

router.post("/signup",wrapAsync(signup));

router.get("/login",  renderLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login', failureFlash: true}), login)

router.get("/logout", logout)

module.exports = router;