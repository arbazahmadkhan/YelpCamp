var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleWare = require("../middleWare");
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
router.get("/", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", err.message);
            res.render("back");
            console.log("Something Went Wrong:"+err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
        }
    });
    
});

router.post("/", middleWare.isLogedIn , function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.desc;
   var author={
                id:req.user._id,
                username:req.user.username   };
                
   var newCampground ={name:name, image:image, description:desc, author:author};
   Campground.create(newCampground, function(err, newCamp){
       if(err){
            console.log("Something Went Wrong: "+err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            console.log("Added New Campground Successfully!!"+ newCamp);
            req.flash("success", "Campground Added!!!");
           res.redirect("/campgrounds");
        }
   });
   
});

router.get("/new", middleWare.isLogedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//Show route
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log("Something Went Wrong: "+err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
       
            res.render("campgrounds/show",{campground:campground});
        }
    }); 
});

router.get("/:id/edit",middleWare.checkCampgroundOwnership, function(req, res) {
    
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err)
                console.log(err.message);
                
                res.render("campgrounds/edit",{campground:foundCampground});
        });
});

router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res){
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
       if(err)
            req.flash("error", err.message);
       else
           req.flash("success", "Updated Campground!!!");
           res.redirect("/campgrounds/"+campground._id);
       
    });
});

router.delete("/:id", middleWare.checkCampgroundOwnership, function(req, res){
    
        Campground.findByIdAndRemove(req.params.id,req.body.campground, function(err, campground) {
       if(err)
            req.flash("error", err.message);
       else
            req.flash("success", "Deleted Campground!!!");
            res.redirect("/campgrounds");
   }); 
   
});



module.exports = router;