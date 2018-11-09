var express = require("express");
var app = express();
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");



var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");

var campgroundRoutes = require("./routes/campgroundRoutes");
var commentRoutes = require("./routes/commentRoutes");
var indexRoutes = require("./routes/indexRoutes");

//seedDB(); //Seed Data base with dummy data
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));


app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret:"What an issue",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose.connect("mongodb://localhost/Yelp_Camp_V8");
mongoose.connect("mongodb://arbaz:password00@ds157493.mlab.com:57493/yelpcamp");


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started!!! - V 8");
});