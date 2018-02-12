var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//ROOT
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", "Coś poszło nie tak...");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }

    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var opis = req.body.opis;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, opis: opis, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Coś poszło nie tak...");
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});


//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});


//SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });

});


//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            console.log(err);
            req.flash("error", "Coś poszło nie tak...");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Dane obozu zaktualizowane");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err, foundCampground) {
       if(err){
           console.log(err);
           res.redirect("/campgrounds/" + req.params.id);
       } else {
           res.redirect("/campgrounds");
       }
   });
});


module.exports = router;