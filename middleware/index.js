var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Musisz być zalogowany");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Coś poszło nie tak...");
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Brak uprawnien");
                    res.redirect("back");
                } 
            }
        }); 
    } else {
        req.flash("error", "Musisz być zalogowany");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Coś poszło nie tak...");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Brak uprawnien");
                    res.redirect("back");
                } 
            }
        }); 
    } else {
        req.flash("error", "Musisz być zalogowany");
        res.redirect("back");
    }
};

module.exports = middlewareObj;