var express = require("express");
var router = express.Router({mergeParams:true});
var passport = require("passport");
var User = require("../models/user");
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

router.get("/", function(req, res){
   
   res.render("landing");
    
});

router.get("/register", function(req, res){ 
    res.render("register");
});

router.post("/register", function(req, res){
   User.register(new User({username:req.body.username}), req.body.password, function(err, user){
      if(err){
          req.flash("error", err.message);
          return res.redirect("/register");
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome "+req.body.username+"!!!")
         res.redirect("/campgrounds"); 
      });
   }); 
});

router.get("/login", function(req, res){ 
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    successFlash:"Welcome Back!!!",
    failureRedirect:"/login",
    failureFlash:"Invalid Username and/or Password"
}),function(req, res){
    
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logout Successfully !!!");
    res.redirect("/campgrounds");
});

module.exports = router;