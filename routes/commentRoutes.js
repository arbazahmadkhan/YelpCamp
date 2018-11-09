var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleWare");

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
router.get("/new", middleWare.isLogedIn, function(req, res) {
   
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash("error", err.message);
           res.render("back");
       }
       else{
           res.render("comments/new", {campground:campground});
       }
   }) ;
});

router.post("/", middleWare.isLogedIn, function(req, res){
        Campground.findById(req.params.id, function(err, campground) {
           if(err){
               req.flash("error", err.message);
               res.redirect("back");
           } 
           else{
                    
               Comment.create(req.body.comment, function(err, comment){
                   if(err){
                       req.flash("error", err.message);
                       res.redirect("back");
                   }
                   else{
                       comment.author.id=req.user._id;
                       comment.author.username =req.user.username;
                       comment.save();
                       campground.comments.push(comment);
                       campground.save(function(err, savedCampgrount){
                           if(err){
                               req.flash("error", err.message);
                               res.back("back");
                           }
                           else{
                               req.flash("success", "Comment Added!");
                               res.redirect("/campgrounds/"+campground._id);
                           }
                       });
                       
                   }
               });
               
               
           }
        });
});

router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            Campground.findById(req.params.id, function(err, campground) {
                if(err){
                    req.flash("error", err.message);
                    res.redirect("/campgrounds/"+req.params.id);
                }
                else{
                    res.render("comments/edit", {campground:campground, comment:comment});
                }
            });
        }
        
            
    });
    
});
router.put("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err)
            req.flash("error", err.message);
        else
            req.flash("success", "Comment updated!!!");
            res.redirect("/campgrounds/"+req.params.id);
    });
    
});
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if(err)
            req.flash("error", err.message);
        else
            req.flas("success", "Deleted Comment Successfully!!!");
            res.redirect("/campgrounds/"+req.params.id);
    });
    
});



module.exports = router;