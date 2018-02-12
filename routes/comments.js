var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
                res.render("comments/new", {campground: campground});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            req.flash("error", "Coś poszło nie tak...");
            res.redirect("back");
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error", "Coś poszło nie tak...");
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment._id);
                    campground.save();
                    req.flash("success", "Dodano nowy komentarz");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            req.flash("error", "Coś poszło nie tak...");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Coś poszło nie tak...");
            res.redirect("back");
        } else {
            req.flash("success", "Komentarz został zaktualizowany");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Komentarz został usunięty");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;