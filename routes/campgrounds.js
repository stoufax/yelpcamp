var express = require("express");
var router  = express.Router();
var Campground = require("../models/campgrounds");
var middlewareObj = require("../middleware");

//============================
// Campground ROUTES
//============================

// INDEX - show all campgrounds
router.get("/", function(req,res){
    
    Campground.find({},function(err,allcampgrounds){
    if(err){
        console.log(err);
    }
    else{
        res.render("campgrounds/index",{campgrounds:allcampgrounds});
    }
    });
});

// create - add new campgrounds to db
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.url;
    var price = req.body.price
    var des = req.body.description;
    var author ={id :req.user._id , username:req.user.username};
    var newCampground = {name:name, price :price, image:image, description:des, author:author};
    Campground.create(newCampground, function(err,campground){
        if (err){
            console.log("error") 
        }
        else{
            res.redirect("/campgrounds"); 
        }
    });
});

// NEW - show form to create new campgrounds
router.get("/new", middlewareObj.isLoggedIn,function(req, res) {
  res.render("campgrounds/new")
});

// SHOW - show more info about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
            
             res.render("campgrounds/show",{campground : foundcampground});
        }
    });
});  

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middlewareObj.authorizationCampground, function(req, res){
    Campground.findById(req.params.id, function(err,campground){
        res.render("campgrounds/edit", {campground:campground})
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middlewareObj.authorizationCampground, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
        if (err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+req.params.id )
        }
    });
});
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middlewareObj.authorizationCampground, function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds")
      } else{
          res.redirect("/campgrounds")
      }
    });   
});


module.exports = router;