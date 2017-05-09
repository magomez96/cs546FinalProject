const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../data');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;

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
                res.render("homepage/static", [gotUser].concat(items));
            })
        });
    }
});

router.get("/loginFail", (req, res) => {
    res.send('Failed to authenticate');
});

router.get("/private", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/users/')
    } else {
        res.redirect('/');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;