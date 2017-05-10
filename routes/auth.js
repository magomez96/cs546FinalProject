const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../data');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;
const bcrypt = require('bcrypt-nodejs');

router.get("/login", (req, res) => {
    req.logout();
    res.render("auth/static", { error: req.flash('error') });
})

router.get("/", (req, res) => { //homepage
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    } else {
        usersData.getUserById(req.user._id).then((gotUser) => {
            itemsData.joinProducts(req.user._id).then((items) => {
                    console.log(items)
                    items = items.sort(function(a,b) { 
                        return new Date(a.date_of_expiration).getTime() - new Date(b.date_of_expiration).getTime() 
                    }); 
                    console.log(items)
                res.render("homepage/static", [gotUser].concat(items));
            })
        });
    }
});

router.get("/loginFail", (req, res) => {
    res.send('Failed to authenticate');
});

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/')
    } else {
        res.render("auth/static", { error: req.flash('error') });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    if (req.isAuthenticated()){
        req.logout();
        res.render("auth/static", { logoutMsg: "Logout successful" });
    }
});

router.get('/registration', (req, res) => {
    res.render("auth/registration")
});

router.get("/registered", (req, res) => {
    res.render("auth/static", {logoutMsg: "Please log in with your new credentials"});
});

//TODO: Session ID stuff
router.post('/register', (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let diet = req.body.diet;
 
    bcrypt.hash(req.body.password, null, null, function(err, hash){
        return usersData.addUser(hash, 0, name, diet, email).then((newUser) =>{
            res.redirect("/registered");
        });
    });
});
module.exports = router;