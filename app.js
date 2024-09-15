const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride =  require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}



const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const homeRouter = require('./routes/home.js')
const MongoStore = require('connect-mongo');
const Listing = require('./models/listing.js');

app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));

// const dbUrl = process.env.ATLASDB_URL;
const dbUrl = "mongodb://127.0.0.1:27017/myapp";


main().then((result) => {
    console.log("connected");
}).catch((err) => {
    console.log("database"+err);
});


async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE")
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demo",async (req, res)=>{
    let fakeUser = new User({
        email: "aditya@4455",
        username: "delta-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser)
})

//for home
app.use("/", homeRouter)

//All listing routes
app.use("/listings", listingRouter)

//all Review routes
app.use("/listings/:id/reviews", reviewRouter)

//for signups
app.use("/",userRouter);

//for random route
app.all("*",(req, res, next) => {
    next(new ExpressError(404, "page not found"))
});

//for error handling
app.use((err, req, res, next)  => {
    let {status=500, message="something went wrong"} = err;
    // res.status(status).send(message);
     console.log(err);
    res.render("./error.ejs",{message});
})

// app.get("/listings",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successs")
// });

app.listen(8080,()=>{
    console.log("listening...");
});