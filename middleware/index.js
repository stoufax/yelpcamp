var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

var middlewareObj={};

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you must log in");
    res.redirect("/login");
};

middlewareObj.authorizationComment = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,comment){

            if (err){
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you dont have permision to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "you must log in");
        res.redirect("back");
    }
};

middlewareObj.authorizationCampground = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,campground){
               if(err){
                   res.redirect("back");
               }else{
                   if(campground.author.id.equals(req.user._id)){
                       next();
                   }else{
                       req.flash("error", "you dont have permision to do that");
                       res.redirect("back");
                   }
               }
           });
    }else{
        req.flash("error", "you must log in");
        res.redirect("back");
    }
};

module.exports = middlewareObj;