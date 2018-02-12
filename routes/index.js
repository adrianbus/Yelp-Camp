var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Root route    
router.get("/", function(req, res){
    res.render("landing");
});


//Register

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Witamy w YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//LogIn

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}), function(req, res) {
        console.log(currentUser);
});

//LogOut

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Wylogowano");
   res.redirect("/campgrounds");
});

module.exports = router;