var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");

//============================
// Comment ROUTES
//============================

// Comment New
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    //find campgrounds by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});

// Comment create
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    //lookup campground usinf id
    Campground.findById(req.params.id, function(err, campground) {
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err)
                }else{
                    //add id and username  to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        } 
    });
    //create new comment
    //connect new comment to campground
    // redirect campground show page
});

//edit Comment
router.get("/:comment_id/edit", middlewareObj.authorizationComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
         if(err){
             res.redirect("back")
         }else{
             res.render("comments/edit",{comment:comment,campground_id:req.params.id})
              }
    });
});

// Update Comment
router.put("/:comment_id", middlewareObj.authorizationComment, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
   });
});

//Destroy Comment
router.delete("/:comment_id", middlewareObj.authorizationComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
});



module.exports = router;