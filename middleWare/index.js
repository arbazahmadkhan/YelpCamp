var Comment = require("../models/comment");
var Campground = require("../models/campground");

var middleWare ={};


middleWare.isLogedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next();
        req.flash("error", "Please login first");
        res.redirect("/login");
};

middleWare.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", err.message);
               res.redirect("back");
           }else
           {
               if(foundCampground.author.id.equals(req.user.id))
                    return    next();
                req.flash("error", "You are not owner of this Campground");
                res.redirect("/campgrounds");
           }
        });
    }
    else{
        req.flash("error","You need to be logged in!!!");
        res.redirect("back");
        
    }
};

middleWare.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }
            else{
                if(comment.author.id.equals(req.user._id))
                  return next(); 
                  
                req.flash("error", "You are not author of this comment");  
                res.redirect("back");
                
            }    
            
        });
    }else{
        req.flash("error","You need to be logged in first!!!");
        res.redirect("/login");
    }
};


module.exports = middleWare;